const express = require("express");
const router = express.Router();
const matchController = require("../controllers/matchController");

router.get("/", matchController.getAllMatches);
router.post("/", matchController.match);
router.post("/scan/jd/:id", matchController.scanByJob);
router.post("/scan/all", matchController.scanByAllJobs);

module.exports = router;
