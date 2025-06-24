const Lesson = require("../models/Lesson");

exports.getAllLessons = async (req, res) => {
  const lessons = await Lesson.find({ createdBy: req.user._id }).sort("-createdAt");
  res.render("lessons", { lessons });
};

exports.renderNewLessonForm = (req, res) => {
  res.render("lesson", { lesson: null });
};

exports.createLesson = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    await Lesson.create({
      title,
      description,
      tags: tags?.split(",").map(tag => tag.trim()),
      createdBy: req.user._id,
    });
    req.flash("info", "Lesson created successfully!");
    res.redirect("/lessons");
  } catch (err) {
    req.flash("errors", [err.message]);
    res.redirect("/lessons/new");
  }
};

exports.renderEditForm = async (req, res) => {
  const lesson = await Lesson.findOne({ _id: req.params.id, createdBy: req.user._id });
  if (!lesson) return res.status(404).send("Lesson not found");
  res.render("lesson", { lesson });
};

exports.updateLesson = async (req, res) => {
  const { title, description, tags } = req.body;
  await Lesson.updateOne(
    { _id: req.params.id, createdBy: req.user._id },
    { title, description, tags: tags?.split(",").map(tag => tag.trim()) }
  );
  req.flash("info", "Lesson updated!");
  res.redirect("/lessons");
};

exports.deleteLesson = async (req, res) => {
  await Lesson.deleteOne({ _id: req.params.id, createdBy: req.user._id });
  req.flash("info", "Lesson deleted.");
  res.redirect("/lessons");
};
