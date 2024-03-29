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
const Authenticate = require("../middlewares/Authenticate");
const {
  CheckEditRights,
  CheckAddRights,
  CheckDeleteRights,
} = require("../middlewares/CheckRights");

const router = require("express").Router();

router.get("/", GetProducts);
router.get("/id/:id", GetProductsById);
router.get("/category/:category_id", GetProductsByCategory);
router.get("/featured", GetFeaturedProducts);
router.get("/new-arrival", GetNewArrivalProducts);
router.get("/best-seller", GetBestSellerProducts);
router.post("/", Authenticate, CheckAddRights, AddProducts);
router.put("/:id", Authenticate, CheckEditRights, UpdateProducts);
router.delete("/:id", Authenticate, CheckDeleteRights, DeleteProducts);

module.exports = router;
