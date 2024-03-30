const router = require("express").Router();
const Authenticate = require("../middlewares/Authenticate");
const {
  CheckViewRights,
  CheckAddRights,
  CheckEditRights,
  CheckDeleteRights,
} = require("../middlewares/CheckRights");

const {
  GetAllRoles,
  GetRoleById,
  CreateRole,
  UpdateRole,
  DeleteRole,
} = require("../controllers/role");

router.get("/", Authenticate, CheckViewRights, GetAllRoles);
router.get("/:id", Authenticate, CheckViewRights, GetRoleById);
router.post("/", Authenticate, CheckAddRights, CreateRole);
router.put("/:id", Authenticate, CheckEditRights, UpdateRole);
router.delete("/:id", Authenticate, CheckDeleteRights, DeleteRole);

module.exports = router;
