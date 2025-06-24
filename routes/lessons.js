const express = require("express");
const router = express.Router();
const lessons = require("../controllers/lessons");
const { isLoggedIn } = require("../middleware/auth");

const Lesson = require("../models/Lesson");
const Comment = require("../models/Comment");


router.get("/", lessons.getAllLessons);
router.get("/new", lessons.renderNewLessonForm);
router.post("/", lessons.createLesson);
router.get("/edit/:id", lessons.renderEditForm);
router.post("/update/:id", lessons.updateLesson);
router.post("/delete/:id", lessons.deleteLesson);


router.get("/view/:id", isLoggedIn, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
   // const comments = await Comment.find({ lesson: req.params.id }).populate("createdBy");
    const comments = await Comment.find({ lesson: req.params.id }).populate("author");

    //res.render("lessonView", { lesson, comments });

    lesson.comments = comments;
    res.render("lesson", { lesson });

  } catch (err) {
    console.log(err);
    req.flash("errors", ["Lesson not found."]);
    res.redirect("/lessons");
  }
});

module.exports = router;
