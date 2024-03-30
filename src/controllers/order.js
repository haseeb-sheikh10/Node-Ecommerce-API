const { Order, validate } = require("../models/order");
const { User } = require("../models/user");

const GetOrders = async (req, res) => {
  try {
    const orders = await Order.find().lean();
    for (let i = 0; i < orders.length; i++) {
      if (orders[i].user_id)
        orders[i].user = await User.findById(orders[i].user_id);
    }
    return res.status(200).json({
      status: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const GetOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (order.user_id) order.user = await User.findById(order.user_id);
    return res.status(200).json({
      status: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const GetOrdersByUser = async (req, res) => {
  try {
    if (req.user._id !== req.params.user_id)
      return res.status(403).json({
        status: false,
        message: "You are not authorized to view this user's orders",
      });

    const orders = await Order.find({ user_id: req.params.user_id }).lean();
    for (let i = 0; i < orders.length; i++) {
      if (orders[i].user_id)
        orders[i].user = await User.findById(orders[i].user_id);
    }
    return res.status(200).json({
      status: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const CreateOrder = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });

    const order = new Order(req.body);
    await order.save();
    return res.status(201).json({
      status: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const UpdateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({
        status: false,
        message: "Order not found",
      });

    order.order_status = req.body.order_status;
    await order.save();
    return res.status(200).json({
      status: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const UpdatePaymentStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({
        status: false,
        message: "Order not found",
      });

    order.payment_status = req.body.payment_status;
    await order.save();
    return res.status(200).json({
      status: true,
      message: "Payment status updated successfully",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const DeleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({
        status: false,
        message: "Order not found",
      });

    await Order.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      status: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const CancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({
        status: false,
        message: "Order not found",
      });

    order.order_status = "cancelled";
    await order.save();
    return res.status(200).json({
      status: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  GetOrders,
  GetOrderById,
  GetOrdersByUser,
  CreateOrder,
  UpdateOrderStatus,
  UpdatePaymentStatus,
  DeleteOrder,
  CancelOrder,
};
