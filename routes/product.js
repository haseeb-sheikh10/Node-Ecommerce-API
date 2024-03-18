const {
  GetProducts,
  GetProductsById,
  GetProductsByCategory,
  AddProducts,
  UpdateProducts,
  DeleteProducts,
  GetFeaturedProducts,
  GetNewArrivalProducts,
  GetBestSellerProducts,
} = require("../controllers/product");
const authenticate = require("../middlewares/authenticate");

const router = require("express").Router();

router.get("/", GetProducts);
router.get("/id/:id", GetProductsById);
router.get("/category/:category_id", GetProductsByCategory);
router.get("/featured", GetFeaturedProducts);
router.get("/new-arrival", GetNewArrivalProducts);
router.get("/best-seller", GetBestSellerProducts);
router.post("/", authenticate, AddProducts);
router.put("/:id", authenticate, UpdateProducts);
router.delete("/:id", authenticate, DeleteProducts);

module.exports = router;
