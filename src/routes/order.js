const Authenticate = require("../middlewares/Authenticate");
const {
  CheckEditRights,
  CheckDeleteRights,
  CheckViewRights,
} = require("../middlewares/CheckRights");

const router = require("express").Router();

const {
  GetOrders,
  GetOrderById,
  GetOrdersByUser,
  CreateOrder,
  UpdateOrderStatus,
  UpdatePaymentStatus,
  DeleteOrder,
  CancelOrder,
} = require("../controllers/order");

router.get("/", Authenticate, CheckViewRights, GetOrders);
router.get("/:id", Authenticate, CheckViewRights, GetOrderById);
router.get("/user/:user_id", Authenticate, GetOrdersByUser);
router.post("/", CreateOrder);
router.put(
  "/update-order-status/:id",
  Authenticate,
  CheckEditRights,
  UpdateOrderStatus
);
router.put(
  "/update-payment-status/:id",
  Authenticate,
  CheckEditRights,
  UpdatePaymentStatus
);

router.delete("/:id", Authenticate, CheckDeleteRights, DeleteOrder);
router.put("/cancel-order/:id", CancelOrder);

module.exports = router;
