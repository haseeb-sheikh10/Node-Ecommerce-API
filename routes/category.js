const authenticate = require("../middlewares/authenticate");

const router = require("express").Router();
const {
  GetCategories,
  GetCategoryById,
  AddCategory,
  UpdateCategory,
  DeleteCategory,
} = require("../controllers/category");

router.get("/", GetCategories);
router.get("/:id", GetCategoryById);
router.post("/", authenticate, AddCategory);
router.put("/:id", authenticate, UpdateCategory);
router.delete("/:id", authenticate, DeleteCategory);

module.exports = router;
