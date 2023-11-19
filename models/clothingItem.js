const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  weather: {
    type: String,
    required: true,
    enum: ["hot", "warm", "cold"],
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "Link is not valid",
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    default: {},
  },
  likes: {
    //placeholder to user
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

model.exports = mongoose.model("clothingItem", ClothingItemSchema);
