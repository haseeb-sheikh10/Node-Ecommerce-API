const authenticate = require("../middlewares/authenticate");

const router = require("express").Router();

const { GetCart, AddToCart, RemoveFromCart } = require("../controllers/cart");

router.get("/", authenticate, GetCart);
router.post("/", authenticate, AddToCart);
router.delete("/", authenticate, RemoveFromCart);

module.exports = router;
