const { AnnonymousCart, validate } = require("../models/annonymous-cart");
const { Product } = require("../models/product");

const GetCart = async (req, res) => {
  try {
    const { cart_id } = req.query;
    let cart;
    if (!cart_id) {
      cart = new AnnonymousCart({ items: [] });
      await cart.save();
    } else {
      cart = await AnnonymousCart.findById(cart_id).lean();
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
    const { cart_id, product_id, quantity } = req.body;
    const { error } = validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ status: false, message: error.details[0].message });
    }

    const product = await Product.findById(product_id);
    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    }

    let cart = await AnnonymousCart.findOne({ _id: cart_id });
    if (!cart) {
      cart = new AnnonymousCart({ items: [{ product_id, quantity }] });
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
    const { cart_id, product_id } = req.body;

    let cart = await AnnonymousCart.findOne({ _id: cart_id });
    if (!cart) {
      return res
        .status(404)
        .json({ status: false, message: "AnnonymousCart not found" });
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
