const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController");

router.post(
  "/",
  uploadController.uploadMiddleware,
  uploadController.uploadAndExtract
);

// Route mới để upload và trích xuất thông tin JD từ file PDF
router.post(
  "/jd",
  uploadController.uploadMiddleware,
  uploadController.uploadAndExtractJD
);

module.exports = router;
