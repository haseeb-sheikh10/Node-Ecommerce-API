const Authenticate = require("../middlewares/Authenticate");

const router = require("express").Router();

const {
  GetCommentsByProduct,
  AddComment,
  UpdateComment,
  DeleteComment,
} = require("../controllers/comment");

router.get("/", GetCommentsByProduct);
router.post("/", Authenticate, AddComment);
router.put("/:id", Authenticate, UpdateComment);
router.delete("/:id", Authenticate, DeleteComment);

module.exports = router;
