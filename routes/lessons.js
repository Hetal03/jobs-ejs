const express = require("express");
const router = express.Router();
const lessons = require("../controllers/lessons");
const { isLoggedIn } = require("../middleware/auth");

const Lesson = require("../models/Lesson");
const Comment = require("../models/Comment");

//const csrf = require("csurf"); // ✅ add this
//const csrfProtection = csrf();


router.get("/", lessons.getAllLessons);
router.get("/new", lessons.renderNewLessonForm);
router.post("/", lessons.createLesson);
router.get("/edit/:id", lessons.renderEditForm);
router.post("/update/:id", lessons.updateLesson);
router.post("/delete/:id", lessons.deleteLesson);


router.get("/view/:id", isLoggedIn, async (req, res) => {
  try {
    // Find lesson by id AND it must be published OR the lesson belongs to the logged in user (owner)
    const lesson = await Lesson.findOne({
      _id: req.params.id,
      $or: [
        { isPublished: true },
        { createdBy: req.user._id }
      ],
    });

    if (!lesson) {
      req.flash("errors", ["Lesson not found or you don't have access."]);
      return res.redirect("/explore"); // redirect to explore instead of lessons list
    }

    const comments = await Comment.find({ lesson: lesson._id }).populate("author");

    res.render("lessonView", { lesson, comments });
  } catch (err) {
    console.log(err);
    req.flash("errors", ["Error loading lesson."]);
    res.redirect("/explore");
  }
});


// Public Explore page - shows all published lessons
router.get("/explore", isLoggedIn, async (req, res) => {
  try {
    // Find all lessons where isPublished is true
    const lessons = await Lesson.find({ isPublished: true }).sort("-createdAt");
    res.render("explore", { lessons }); // Pass csrf token for comment forms
  } catch (err) {
    console.log(err);
    req.flash("errors", ["Could not load lessons."]);
    res.redirect("/");
  }
});


module.exports = router;
