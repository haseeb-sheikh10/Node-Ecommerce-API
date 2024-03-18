const authenticate = require("../middlewares/authenticate");

const router = require("express").Router();

const {
  GetCommentsByProduct,
  AddComment,
  UpdateComment,
  DeleteComment,
} = require("../controllers/comment");

router.get("/", GetCommentsByProduct);
router.post("/", authenticate, AddComment);
router.put("/:id", authenticate, UpdateComment);
router.delete("/:id", authenticate, DeleteComment);

module.exports = router;
