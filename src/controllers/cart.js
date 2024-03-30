const { Cart, validate } = require("../models/cart");
const { Product } = require("../models/product");

const GetCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user_id: req.user._id }).lean();
    if (!cart) {
      cart = new Cart({ user_id: req.user._id, items: [] });
      await cart.save();
    } else {
      let totalCartPrice = 0;
      let totalCartQuantity = 0;
      for (let item of cart.items) {
        item.product = await Product.findById(item.product_id).lean();
        item.totalProductPrice = item.product.price.new_price * item.quantity;
        totalCartPrice += item.product.price.new_price * item.quantity;
        totalCartQuantity += item.quantity;
      }
      cart.totalCartPrice = parseFloat(totalCartPrice.toFixed(2));
      cart.totalCartQuantity = totalCartQuantity;
    }
    return res.status(200).json({
      status: true,
      message: "Cart fetched successfully",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const AddToCart = async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;
    const { error } = validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ status: false, message: error.details[0].message });
    }

    if (req.user._id != user_id) {
      return res.status(403).json({
        status: false,
        message: "You can only add in your cart.",
      });
    }

    const product = await Product.findById(product_id);
    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    }

    let cart = await Cart.findOne({ user_id });
    if (!cart) {
      cart = new Cart({ user_id, items: [{ product_id, quantity }] });
    } else {
      const existingItems = cart.items.find(
        (item) => item.product_id == product_id
      );
      if (existingItems) {
        existingItems.quantity = quantity;
      } else {
        cart.items.push({ product_id, quantity });
      }
    }

    await cart.save();
    return res.status(200).json({
      status: true,
      message: "Product added to cart successfully",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const RemoveFromCart = async (req, res) => {
  try {
    const { user_id, product_id } = req.body;

    if (req.user._id != user_id) {
      return res.status(403).json({
        status: false,
        message: "You can only remove from your cart.",
      });
    }

    let cart = await Cart.findOne({ user_id });
    if (!cart) {
      return res.status(404).json({ status: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.product_id != product_id);
    await cart.save();
    return res.status(200).json({
      status: true,
      message: "Product removed from cart successfully",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { GetCart, AddToCart, RemoveFromCart };
