const router = require("express").Router();
const ProductController = require("../controllers/products.controllers");

router.get("/", ProductController.getAllProducts);
// router.post("/", OrderController.createOrder);
// router.put("/", OrderController.updateOrder);
// router.delete("/", OrderController.deleteOrder);

module.exports = router;
