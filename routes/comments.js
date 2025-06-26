const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const Lesson = require("../models/Lesson");
const { isLoggedIn } = require("../middleware/auth");


router.post("/add/:lessonId", isLoggedIn, async (req, res) => {
  try {
    const lesson = await Lesson.findOne({
      _id: req.params.lessonId,
      $or: [
        { isPublished: true }, // anyone can comment on published lessons
        { createdBy: req.user._id } // or on their own unpublished ones
      ]
    });

    if (!lesson) {
      req.flash("errors", ["You do not have access to comment on this lesson."]);
      return res.redirect("/explore");
    }

    // 💬 Create and save comment
    const comment = await Comment.create({
      lesson: lesson._id,
      text: req.body.text,
      author: req.user._id,
    });

    // ✅ Optional: Push to lesson.comments array if you're using that
    lesson.comments.push(comment._id);
    await lesson.save();

    req.flash("info", "Comment added.");
    res.redirect("/lessons/view/" + lesson._id);
  } catch (err) {
    console.error(err);
    req.flash("errors", ["Failed to add comment."]);
    res.redirect("/explore");
  }
});

module.exports = router;
