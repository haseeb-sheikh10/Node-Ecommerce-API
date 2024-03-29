const Authenticate = require("../middlewares/Authenticate");

const router = require("express").Router();

const { GetCart, AddToCart, RemoveFromCart } = require("../controllers/cart");

router.get("/", Authenticate, GetCart);
router.post("/", Authenticate, AddToCart);
router.delete("/", Authenticate, RemoveFromCart);

module.exports = router;
