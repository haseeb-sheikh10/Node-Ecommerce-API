const Joi = require("joi");
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  image: {
    type: String,
    required: false,
    default: null,
  },
  name: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const validate = (category) => {
  const schema = Joi.object({
    image: Joi.object().allow(null).optional(),
    name: Joi.string().min(3).max(255).required(),
  });
  return schema.validate(category);
};

const Category = mongoose.model("Category", categorySchema);
module.exports = { Category, validate };
