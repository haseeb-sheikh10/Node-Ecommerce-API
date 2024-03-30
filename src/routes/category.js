const Authenticate = require("../middlewares/Authenticate");

const router = require("express").Router();
const {
  GetCategories,
  GetCategoryById,
  AddCategory,
  UpdateCategory,
  DeleteCategory,
} = require("../controllers/category");
const {
  CheckAddRights,
  CheckEditRights,
  CheckDeleteRights,
} = require("../middlewares/CheckRights");
const { upload } = require("../middlewares/Multer");

router.get("/", GetCategories);
router.get("/:id", GetCategoryById);
router.post(
  "/",
  Authenticate,
  CheckAddRights,
  upload.single("image"),
  AddCategory
);
router.put(
  "/:id",
  Authenticate,
  CheckEditRights,
  upload.single("image"),
  UpdateCategory
);
router.delete("/:id", Authenticate, CheckDeleteRights, DeleteCategory);

module.exports = router;
