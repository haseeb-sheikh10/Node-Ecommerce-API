const {
  Login,
  Register,
  Logout,
  ForgotPassword,
  ResetPassword,
} = require("../controllers/auth");
const authenticate = require("../middlewares/authenticate");

const router = require("express").Router();

router.post("/login", Login);
router.post("/register", Register);
router.post("/logout", authenticate, Logout);
router.post("/forgot-password", ForgotPassword);
router.post("/reset-password/:user_id/:token", ResetPassword);

module.exports = router;
