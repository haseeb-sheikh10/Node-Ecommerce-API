const Joi = require("joi");
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  items: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const validate = (cart) => {
  const schema = Joi.object({
    user_id: Joi.string().required(),
    product_id: Joi.string().required(),
    quantity: Joi.number().required(),
  });
  return schema.validate(cart);
};

const Cart = mongoose.model("Cart", cartSchema);
module.exports = { Cart, validate };
