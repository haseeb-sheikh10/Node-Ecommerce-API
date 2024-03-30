const router = require("express").Router();

const {
  GetCart,
  AddToCart,
  RemoveFromCart,
} = require("../controllers/annonymous-cart");

router.get("/", GetCart);
router.post("/", AddToCart);
router.delete("/", RemoveFromCart);

module.exports = router;
