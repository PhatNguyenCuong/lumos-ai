const express = require("express");
const router = express.Router();
const facematchController = require("../controllers/facematchController");

router.post(
  "/",
  facematchController.uploadFaceImages,
  facematchController.matchFaces
);

module.exports = router;

