const {
  GetProducts,
  GetProductsById,
  GetProductsByCategory,
  AddProducts,
  UpdateProducts,
  DeleteProducts,
} = require("../controllers/product");
const authenticate = require("../middlewares/authenticate");

const router = require("express").Router();

router.get("/", GetProducts);
router.get("/id/:id", GetProductsById);
router.get("/category/:category_id", GetProductsByCategory);
router.post("/", authenticate, AddProducts);
router.put("/:id", authenticate, UpdateProducts);
router.delete("/:id", authenticate, DeleteProducts);

module.exports = router;
