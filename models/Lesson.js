const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Lesson must have a title"],
  },
  description: {
    type: String,
    required: [true, "Lesson must have a description"],
  },
  tags: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],


}, { timestamps: true });

module.exports = mongoose.model("Lesson", lessonSchema);
