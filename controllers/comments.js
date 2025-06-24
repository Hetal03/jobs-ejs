// controllers/comments.js
const Comment = require("../models/Comment");
const Lesson = require("../models/Lesson");

exports.addComment = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  try {
    const comment = await Comment.create({
      lesson: id,
      text,
      author: req.user._id,
    });

    await Lesson.findByIdAndUpdate(id, {
      $push: { comments: comment._id },
    });

    req.flash("info", "Comment added");
    res.redirect(`/lessons/view/${id}`);
  } catch (err) {
    console.error(err);
    req.flash("errors", ["Failed to add comment"]);
    res.redirect(`/lessons/view/${id}`);
  }
};
