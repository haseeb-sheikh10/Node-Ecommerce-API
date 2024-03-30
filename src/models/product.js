const Joi = require("joi");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
      required: false,
    },
  ],
  price: {
    sale_price: {
      type: Number,
      required: false,
    },
    new_price: {
      type: Number,
      required: true,
    },
  },
  quantity: {
    type: Number,
    required: true,
  },
  is_featured: {
    type: Boolean,
    default: false,
  },
  is_best_seller: {
    type: Boolean,
    default: false,
  },
  is_new_arrival: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

const validate = (product) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.object({
      sale_price: Joi.number().optional(),
      new_price: Joi.number().required(),
    }),
    quantity: Joi.number().required(),
    is_featured: Joi.boolean(),
    is_best_seller: Joi.boolean(),
    is_new_arrival: Joi.boolean(),
    category_ids: Joi.array().items(Joi.string()).optional(),
  });
  return schema.validate(product);
};

module.exports = {
  Product,
  validate,
};
