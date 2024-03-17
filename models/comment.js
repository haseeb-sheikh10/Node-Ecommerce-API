const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: false,
  },
  rating: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  user_id: {
    type: ObjectId,
    ref: "User",
  },
  product_id: {
    type: ObjectId,
    ref: "Product",
  },
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
