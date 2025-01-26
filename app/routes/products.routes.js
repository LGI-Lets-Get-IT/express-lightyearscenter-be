const router = require("express").Router();
const productController = require("../controllers/products.controllers");

router.get("/", productController.getAllProducts);
router.post("/", productController.createProduct);
// router.put("/", OrderController.updateOrder);
// router.delete("/", OrderController.deleteOrder);

module.exports = router;
