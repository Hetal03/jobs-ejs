const Job = require("../models/Job");

const showJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user._id });
  res.render("jobs", { jobs });
};

const newJobForm = (req, res) => {
  res.render("job", { job: null });
};

const createJob = async (req, res) => {
  const { company, position, status } = req.body;
  await Job.create({ company, position, status, createdBy: req.user._id });
  res.redirect("/jobs");
};

const editJobForm = async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, createdBy: req.user._id });
  if (!job) return res.redirect("/jobs");
  res.render("job", { job });
};

const updateJob = async (req, res) => {
  const { company, position, status } = req.body;
  await Job.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user._id },
    { company, position, status }
  );
  res.redirect("/jobs");
};

const deleteJob = async (req, res) => {
  await Job.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
  res.redirect("/jobs");
};

module.exports = {
  showJobs,
  newJobForm,
  createJob,
  editJobForm,
  updateJob,
  deleteJob,
};
