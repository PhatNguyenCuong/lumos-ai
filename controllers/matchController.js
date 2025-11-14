const { spawn } = require("child_process");
const db = require("../config/db");

exports.getAllMatches = async (req, res) => {
  res.json({ message: "Connected ✅" });
};

exports.match = (req, res) => {
  const { cv_text = "", jd_text = "" } = req.body;

  const python = spawn("python3", ["services/bert_match.py"]);
  const inputData = JSON.stringify({ cv_text, jd_text });

  let output = "";
  let error = "";

  python.stdin.write(inputData);
  python.stdin.end();

  python.stdout.on("data", (data) => {
    output += data.toString();
  });

  python.stderr.on("data", (data) => {
    error += data.toString();
  });

  python.on("close", (code) => {
    if (code !== 0) {
      console.error("Python error:", error);
      return res.status(500).json({ error: "Failed to run BERT matcher" });
    }

    const lines = output.trim().split("\n");
    const lastLine = lines[lines.length - 1];

    try {
      const result = JSON.parse(lastLine);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: "Failed to parse output", raw: output });
    }
  });
};

function runPythonMatch(cv_text, jd_text) {
  return new Promise((resolve, reject) => {
    const python = spawn("python3", ["services/bert_match.py"]);
    let output = "";
    let error = "";

    python.stdin.write(JSON.stringify({ cv_text, jd_text }));
    python.stdin.end();

    python.stdout.on("data", (data) => (output += data.toString()));
    python.stderr.on("data", (data) => (error += data.toString()));

    python.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(error || "Python error"));
      }
      try {
        const lines = output.trim().split("\n");
        const lastLine = lines[lines.length - 1];
        resolve(JSON.parse(lastLine));
      } catch (e) {
        reject(new Error("Failed to parse Python output"));
      }
    });
  });
}

exports.scanByJob = async (req, res) => {
  const { id } = req.params; // jd_id

  const { threshold } = req.body;

  try {
    // 1. Lấy JD từ DB
    const jobRes = await db.query("SELECT * FROM job WHERE id = $1", [id]);
    if (jobRes.rows.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }
    const job = jobRes.rows[0];

    const jd_text = job.job_description || "";
    const jd_title = job.job_title || "";

    // 2. Lấy toàn bộ resumes từ DB
    const resumeRes = await db.query("SELECT * FROM resume");
    const resumes = resumeRes.rows;

    // 3. Chạy so khớp từng CV
    const results = [];
    for (const r of resumes) {
      const cv_text = r.summary || "";
      const cv_title = r.email || "";

      try {
        const match = await runPythonMatch(cv_text, jd_text);
        const match_title = await runPythonMatch(cv_title, jd_title);
        console.log("match_title", match_title);

        results.push({
          resume_id: r.id,
          name: r.name,
          email: r.email,
          matching_result: {
            matching_percentage:
              (match.matching_percentage +
                match_title.matching_percentage * 4) /
              5,
            processing_time:
              (match.processing_time + match_title.processing_time) / 2,
          },
        });
      } catch (err) {
        results.push({
          resume_id: r.id,
          name: r.name,
          email: r.email,
          error: err.message,
        });
      }
    }

    const filteredResults = results.filter(
      (item) =>
        item.matching_result &&
        item.matching_result.matching_percentage >= threshold * 100
    );

    // 5. Trả kết quả đã lọc và sort
    res.json({
      success: true,
      job: { id: job.id, job_title: job.job_title },
      cvs: filteredResults.sort(
        (a, b) =>
          b.matching_result.matching_percentage -
          a.matching_result.matching_percentage
      ),
    });
  } catch (err) {
    console.error("Scan error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Thêm mới: quét tất cả jobs với toàn bộ resumes
exports.scanByAllJobs = async (req, res) => {
  const { threshold = 0 } = req.body; // threshold ở [0..1]

  // helper cục bộ để tránh ảnh hưởng code cũ
  const mapWithConcurrency = async (items, limit, mapper) => {
    const ret = new Array(items.length);
    let idx = 0;

    const worker = async () => {
      while (idx < items.length) {
        const cur = idx++;
        try {
          ret[cur] = await mapper(items[cur], cur);
        } catch (e) {
          ret[cur] = e; // giữ vị trí, caller tự xử lý
        }
      }
    };

    const workers = Array.from(
      { length: Math.min(limit, items.length || 0) },
      worker
    );
    await Promise.allSettled(workers);
    return ret;
  };

  try {
    // 1) Lấy tất cả jobs + resumes một lần
    const [jobRes, resumeRes] = await Promise.all([
      db.query(
        "SELECT id, job_title, job_description FROM job ORDER BY id ASC"
      ),
      db.query("SELECT id, name, email, summary FROM resume ORDER BY id ASC"),
    ]);

    const jobs = jobRes.rows || [];
    const resumes = resumeRes.rows || [];

    if (jobs.length === 0) {
      return res.json({ success: true, jobs: [] });
    }

    // 2) Hàm quét một job với toàn bộ resumes (lọc + sort theo threshold)
    const scanOneJob = async (job) => {
      const jd_text = job.job_description || "";

      // Match resumes với giới hạn đồng thời (có thể chỉnh 4 tùy máy)
      const matches = await mapWithConcurrency(resumes, 4, async (r) => {
        const cv_text = r.summary || "";
        try {
          const match = await runPythonMatch(cv_text, jd_text);
          return {
            resume_id: r.id,
            name: r.name,
            email: r.email,
            matching_result: match,
          };
        } catch (err) {
          return {
            resume_id: r.id,
            name: r.name,
            email: r.email,
            error: err.message,
          };
        }
      });

      const filtered = matches.filter(
        (item) =>
          item &&
          item.matching_result &&
          typeof item.matching_result.matching_percentage === "number" &&
          item.matching_result.matching_percentage >= threshold * 100
      );

      filtered.sort(
        (a, b) =>
          b.matching_result.matching_percentage -
          a.matching_result.matching_percentage
      );

      return {
        job: { id: job.id, job_title: job.job_title },
        cvs: filtered,
      };
    };

    // 3) Chạy quét tất cả jobs với giới hạn đồng thời giữa các job (vd: 2)
    const jobResults = await mapWithConcurrency(jobs, 2, scanOneJob);

    // 4) Trả kết quả
    res.json({
      success: true,
      jobs: jobResults,
    });
  } catch (err) {
    console.error("scanByAllJobs error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
