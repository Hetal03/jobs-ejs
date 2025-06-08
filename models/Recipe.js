const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide recipe title'],
      maxlength: 100,
    },
    type: {
      type: String,
      enum: ['veg', 'non-veg', 'vegan'],
      default: 'veg',
    },
    cookTime: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recipe', RecipeSchema);
