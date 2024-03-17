const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user_id: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  order_date: {
    type: Date,
    default: Date.now,
  },
  total_amount: {
    type: mongoose.Types.Decimal128,
    required: true,
  },
  shipping_address: {
    type: String,
    required: true,
  },
  billing_address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered"],
    default: "pending",
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
