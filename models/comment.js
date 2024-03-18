const Joi = require("joi");
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
});

const validate = (comment) => {
  const schema = Joi.object({
    text: Joi.string().min(3).max(255),
    rating: Joi.number().min(1).max(5).required(),
    user_id: Joi.string().required(),
    product_id: Joi.string().required(),
  });

  return schema.validate(comment);
};

const Comment = mongoose.model("Comment", commentSchema);
module.exports = { Comment, validate };
