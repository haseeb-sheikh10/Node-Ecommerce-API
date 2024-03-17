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
    unique: true,
    nullable: true,
    blank: true,
  },
  address: {
    type: String,
    required: false,
    unique: false,
    nullable: true,
    blank: true,
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
    phone_number: Joi.string().optional(),
    address: Joi.string().optional(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(user);
};

const User = mongoose.model("User", userSchema);

module.exports = { validate, User };
