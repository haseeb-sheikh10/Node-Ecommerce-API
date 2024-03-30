const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  user_id: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  order_id: {
    type: ObjectId,
    ref: "Order",
    required: true,
  },
  payment_date: {
    type: Date,
    default: Date.now,
  },
  payment_method: {
    type: String,
    enum: ["card", "cash", "bank_transfer"],
    required: true,
  },
  amount: {
    type: mongoose.Types.Decimal128,
    required: true,
  },
});

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
