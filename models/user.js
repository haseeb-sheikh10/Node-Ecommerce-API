const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: false,
    index: {
      unique: true,
      partialFilterExpression: { phone_number: { $type: "string" } },
    },
    default: null,
  },
  address: {
    type: String,
    required: false,
    unique: false,
    default: null,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const validate = (user) => {
  const schema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    phone_number: Joi.string().allow(null).optional(),
    address: Joi.string().allow(null).optional(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(user);
};

const User = mongoose.model("User", userSchema);

module.exports = { validate, User };
