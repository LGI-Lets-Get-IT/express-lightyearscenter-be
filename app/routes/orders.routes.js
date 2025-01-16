const router = require("express").Router();
const OrderController = require("../controllers/orders.controllers");

router.get("/", OrderController.getAllOrders);
// router.post("/", OrderController.createOrder);
// router.put("/", OrderController.updateOrder);
// router.delete("/", OrderController.deleteOrder);

module.exports = router;
