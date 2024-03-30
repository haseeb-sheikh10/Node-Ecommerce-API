const router = require("express").Router();
const {
  GetAllUsers,
  GetUserById,
  CreateUser,
  UpdateUser,
  DeleteUser,
  UpdateUserRoles,
} = require("../controllers/user");
const Authenticate = require("../middlewares/Authenticate");
const {
  CheckViewRights,
  CheckAddRights,
  CheckEditRights,
  CheckDeleteRights,
} = require("../middlewares/CheckRights");
const { upload } = require("../middlewares/Multer");

router.get("/", Authenticate, CheckViewRights, GetAllUsers);
router.get("/:id", Authenticate, CheckViewRights, GetUserById);
router.post(
  "/",
  Authenticate,
  CheckAddRights,
  upload.single("profile_picture"),
  CreateUser
);
router.put(
  "/:id",
  Authenticate,
  CheckEditRights,
  upload.single("profile_picture"),
  UpdateUser
);
router.delete("/:id", Authenticate, CheckDeleteRights, DeleteUser);
router.post("/attach-role", Authenticate, CheckEditRights, UpdateUserRoles);

module.exports = router;
