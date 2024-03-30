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
  UploadProductGallery,
} = require("../controllers/product");
const Authenticate = require("../middlewares/Authenticate");
const {
  CheckEditRights,
  CheckAddRights,
  CheckDeleteRights,
} = require("../middlewares/CheckRights");
const { upload } = require("../middlewares/Multer");

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
router.put(
  "/upload-gallery/:id",
  Authenticate,
  CheckEditRights,
  upload.array("product_images", 5),
  UploadProductGallery
);

module.exports = router;
