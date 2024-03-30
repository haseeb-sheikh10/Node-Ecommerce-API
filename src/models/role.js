const Joi = require("joi");
const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  role_name: {
    type: String,
    required: true,
  },
  permissions: {
    add: {
      type: Boolean,
      required: true,
    },
    edit: {
      type: Boolean,
      required: true,
    },
    delete: {
      type: Boolean,
      required: true,
    },
    view: {
      type: Boolean,
      required: true,
    },
  },
});

const validate = (role) => {
  const schema = Joi.object({
    role_name: Joi.string().required(),
    permissions: Joi.object({
      add: Joi.boolean().required(),
      edit: Joi.boolean().required(),
      delete: Joi.boolean().required(),
      view: Joi.boolean().required(),
    }),
  });
  return schema.validate(role);
};
const Role = mongoose.model("Role", roleSchema);

module.exports = { validate, Role };
