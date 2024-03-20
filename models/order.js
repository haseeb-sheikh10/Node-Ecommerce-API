const Joi = require("joi");
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  shipping_address: {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    appartement: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: false,
    },
  },
  billing_address: {
    first_name: {
      type: String,
      required: false,
    },
    last_name: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    appartement: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    zip: {
      type: String,
      required: false,
    },
  },
  shipping_billing_same_address: {
    type: Boolean,
    default: true,
  },
  shipping_method: {
    type: String,
    required: true,
  },
  payment_method: {
    type: String,
    required: true,
  },
  coupon_code: {
    type: String,
    required: false,
  },
  coupon_discount: {
    type: Number,
    required: false,
  },
  payment_status: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  shipping_status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered"],
    default: "pending",
  },
  order_items: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  total_amount: {
    type: Number,
    required: true,
  },
  order_date: {
    type: Date,
    default: Date.now,
  },
});

const validate = (order) => {
  const schema = Joi.object({
    user_id: Joi.string().optional(),
    email: Joi.string().required(),
    shipping_address: Joi.object({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      phone: Joi.string().required(),
      country: Joi.string().required(),
      city: Joi.string().required(),
      appartement: Joi.string().optional(),
      address: Joi.string().required(),
      zip: Joi.string().optional(),
    }).required(),
    billing_address: Joi.object({
      first_name: Joi.string().optional(),
      last_name: Joi.string().optional(),
      phone: Joi.string().optional(),
      country: Joi.string().optional(),
      city: Joi.string().optional(),
      appartement: Joi.string().optional(),
      address: Joi.string().optional(),
      zip: Joi.string().optional(),
    }).optional(),
    shipping_billing_same_address: Joi.boolean().required(),
    shipping_method: Joi.string().required(),
    payment_method: Joi.string().required(),
    coupon_code: Joi.string().optional(),
    coupon_discount: Joi.number().optional(),
    payment_status: Joi.string().valid("pending", "paid", "failed").required(),
    shipping_status: Joi.string()
      .valid("pending", "processing", "shipped", "delivered")
      .required(),
    order_items: Joi.array()
      .items(
        Joi.object({
          product_id: Joi.string().required(),
          quantity: Joi.number().required(),
        })
      )
      .required(),
  });

  return schema.validate(order);
};
const Order = mongoose.model("Order", orderSchema);
module.exports = { Order, validate };
