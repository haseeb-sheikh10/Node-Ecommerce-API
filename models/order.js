const Joi = require("joi");
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
    nullable: true,
    default: null,
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
      default: null,
      nullable: true,
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
      nullable: true,
    },
    last_name: {
      type: String,
      required: false,
      nullable: true,
    },
    phone: {
      type: String,
      required: false,
      nullable: true,
    },
    country: {
      type: String,
      required: false,
      nullable: true,
    },
    city: {
      type: String,
      required: false,
      nullable: true,
    },
    appartement: {
      type: String,
      required: false,
      nullable: true,
    },
    address: {
      type: String,
      required: false,
      nullable: true,
    },
    zip: {
      type: String,
      required: false,
      nullable: true,
    },
  },
  shipping_billing_same_address: {
    type: Boolean,
    default: true,
    required: true,
  },
  shipping_method: {
    type: String,
    required: true,
    enum: ["standard", "express"],
  },
  payment_method: {
    type: String,
    required: true,
    enum: ["cod", "card", "paypal", "bank transfer", "stripe"],
  },
  coupon_code: {
    type: String,
    required: false,
    nullable: true,
    default: null,
  },
  coupon_discount: {
    type: Number,
    required: false,
    default: 0,
  },
  payment_status: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  order_status: {
    type: String,
    enum: [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "returned",
      "refunded",
    ],
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
    user_id: Joi.string().allow(null).optional(),
    email: Joi.string().required(),
    shipping_address: Joi.object({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      phone: Joi.string().required(),
      country: Joi.string().required(),
      city: Joi.string().required(),
      appartement: Joi.string().allow(null).optional(),
      address: Joi.string().required(),
      zip: Joi.string().allow(null).optional(),
    }).required(),
    billing_address: Joi.object({
      first_name: Joi.string().allow(null).optional(),
      last_name: Joi.string().allow(null).optional(),
      phone: Joi.string().allow(null).optional(),
      country: Joi.string().allow(null).optional(),
      city: Joi.string().allow(null).optional(),
      appartement: Joi.string().allow(null).optional(),
      address: Joi.string().allow(null).optional(),
      zip: Joi.string().allow(null).optional(),
    }).optional(),
    shipping_billing_same_address: Joi.boolean().required(),
    shipping_method: Joi.string().valid("standard", "express").required(),
    payment_method: Joi.string()
      .valid("cod", "card", "paypal", "bank transfer", "stripe")
      .required(),
    coupon_code: Joi.string().allow(null).optional(),
    coupon_discount: Joi.number().allow(null).optional(),
    payment_status: Joi.string().valid("pending", "paid", "failed").optional(),
    order_status: Joi.string()
      .valid(
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
        "refunded"
      )
      .optional(),
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
