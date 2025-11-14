const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const uploadsDir = "uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e5
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Middleware: expect two image fields, img1 and img2
exports.uploadFaceImages = upload.fields([
  { name: "img1", maxCount: 1 },
  { name: "img2", maxCount: 1 },
]);

// Controller: run Python face-matching and return its JSON result
exports.matchFaces = (req, res) => {
  console.log("[FaceMatch] Incoming request");

  const img1File = req.files?.img1?.[0];
  const img2File = req.files?.img2?.[0];

  if (!img1File || !img2File) {
    console.warn("[FaceMatch] Missing one or both images");
    return res
      .status(400)
      .json({ error: "Two image files (img1, img2) are required" });
  }

  console.log("[FaceMatch] Image paths:", {
    img1: img1File.path,
    img2: img2File.path,
  });

  const python = spawn("python3", ["services/face_matching.py"]);
  console.log("[FaceMatch] Spawned Python process PID:", python.pid);

  const inputData = JSON.stringify({
    img1_path: img1File.path,
    img2_path: img2File.path,
  });

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
    console.log("[FaceMatch] Python process exited with code:", code);

    if (code !== 0) {
      console.error("Python face_matching error:", error);
      return res.status(500).json({ error: "Failed to run face matcher" });
    }

    try {
      const result = JSON.parse(output.trim().split("\n").pop() || "{}");
      console.log("[FaceMatch] Result:", result);
      res.json(result);
    } catch (e) {
      console.error("[FaceMatch] Failed to parse output:", e);
      res
        .status(500)
        .json({ error: "Failed to parse face matcher output", raw: output });
    }
  });
};
