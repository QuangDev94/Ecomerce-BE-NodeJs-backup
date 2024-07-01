const express = require("express");
const orderController = require("../controllers/OrderController");
const {
  authUserMiddleWare,
  authMiddleWare,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", authUserMiddleWare, orderController.createOrder);

router.get(
  "/get-my-order-all/:id",
  authUserMiddleWare,
  orderController.getMyOrderAll,
);

router.get("/get-order-all", authMiddleWare, orderController.getOrderAll);

router.get(
  "/get-my-order-details/:id",
  authUserMiddleWare,
  orderController.getMyOrderDetails,
);

router.post(
  "/cancel-order/:id",
  authUserMiddleWare,
  orderController.cancelOrder,
);

module.exports = router;
