const router = require("express").Router();
const ProductCategoryController = require("../controllers/productCategory.controllers");

router.get("/", ProductCategoryController.getAllCategories);
// router.post("/", OrderController.createOrder);
// router.put("/", OrderController.updateOrder);
// router.delete("/", OrderController.deleteOrder);

module.exports = router;
