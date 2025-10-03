const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Food name is required'],
      trim: true,
      maxlength: [100, 'Food name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    category: {
      type: String,
      required: [true, 'Food category is required'],
      enum: {
        values: [
          'fruits',
          'vegetables',
          'grains',
          'protein',
          'dairy',
          'fats',
          'beverages',
          'snacks',
          'desserts',
          'spices',
        ],
        message:
          'Category must be one of: fruits, vegetables, grains, protein, dairy, fats, beverages, snacks, desserts, spices',
      },
    },
    nutritionalInfo: {
      calories: {
        type: Number,
        min: [0, 'Calories cannot be negative'],
      },
      protein: {
        type: Number,
        min: [0, 'Protein cannot be negative'],
      },
      carbohydrates: {
        type: Number,
        min: [0, 'Carbohydrates cannot be negative'],
      },
      fat: {
        type: Number,
        min: [0, 'Fat cannot be negative'],
      },
      fiber: {
        type: Number,
        min: [0, 'Fiber cannot be negative'],
      },
      sugar: {
        type: Number,
        min: [0, 'Sugar cannot be negative'],
      },
    },
    allergens: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Index for faster searches
foodSchema.index({ name: 1 });
foodSchema.index({ category: 1 });
foodSchema.index({ tags: 1 });

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
