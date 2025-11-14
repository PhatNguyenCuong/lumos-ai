const multer = require("multer");
const path = require("path");
const { spawn } = require("child_process");

const fs = require("fs");
const uploadsDir = "uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Thiết lập multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e5
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Middleware để xử lý file upload
exports.uploadMiddleware = upload.single("pdf");

exports.uploadAndExtract = (req, res) => {
  const filePath = req.file?.path;
  console.log("filePath", filePath);
  if (!filePath) {
    return res.status(400).json({ error: "Missing PDF file" });
  }

  const python = spawn("python3", ["services/extract_cv.py", filePath]);

  let output = "";
  let error = "";

  python.stdout.on("data", (data) => (output += data.toString()));
  python.stderr.on("data", (data) => (error += data.toString()));

  python.on("close", (code) => {
    if (code !== 0) {
      console.error("Python error:", error);
      return res.status(500).json({ error: "CV extraction failed" });
    }
    try {
      const result = JSON.parse(output);
      res.json(result);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to parse Python output", raw: output });
    }
  });
};

// Hàm xử lý upload và trích xuất thông tin JD từ file PDF
exports.uploadAndExtractJD = (req, res) => {
  const filePath = req.file?.path;
  console.log("Uploaded file path:", filePath);

  if (!filePath) {
    return res.status(400).json({ error: "Missing JD PDF file" });
  }

  // Gọi Python script để trích xuất thông tin JD từ file PDF
  const python = spawn("python3", ["services/extract_jd.py", filePath]);

  let output = "";
  let error = "";

  python.stdout.on("data", (data) => (output += data.toString()));
  python.stderr.on("data", (data) => (error += data.toString()));

  python.on("close", (code) => {
    if (code !== 0) {
      console.error("Python error:", error);
      return res.status(500).json({ error: "JD extraction failed" });
    }

    try {
      const result = JSON.parse(output);
      res.json(result);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to parse Python output", raw: output });
    }
  });
};
