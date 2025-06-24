const express = require("express");
const router = express.Router();
const controller = require("../controllers/jobs");

// All routes protected
router.get("/", controller.showJobs);
router.get("/new", controller.newJobForm);
router.post("/", controller.createJob);
router.get("/edit/:id", controller.editJobForm);
router.post("/update/:id", controller.updateJob);
router.post("/delete/:id", controller.deleteJob);

module.exports = router;
