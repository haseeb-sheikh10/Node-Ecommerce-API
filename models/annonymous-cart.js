const Joi = require("joi");
const mongoose = require("mongoose");

const annonymousCartSchema = new mongoose.Schema({
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
    cart_id: Joi.string().required(),
    product_id: Joi.string().required(),
    quantity: Joi.number().required(),
  });
  return schema.validate(cart);
};

const AnnonymousCart = mongoose.model("AnnonymousCart", annonymousCartSchema);
module.exports = { AnnonymousCart, validate };
