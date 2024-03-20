const { AnnonymousCart } = require("../models/annonymous-cart");
const { Cart } = require("../models/cart");

const SyncCarts = async (user, cart_id = "", isLogin) => {
  try {
    const guestCart = await AnnonymousCart.findById(cart_id);
    if (!guestCart) return;
    let userCart = await Cart.findOne({ user_id: user._id });
    if (!userCart) {
      userCart = new Cart({
        user_id: user._id,
        items: guestCart.items,
      });
      await userCart.save();
    } else {
      if (isLogin) {
        userCart.items = guestCart.items;
      } else {
        guestCart.items = userCart.items;
      }
      await userCart.save();
      await guestCart.save();
    }
    return;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { SyncCarts };
