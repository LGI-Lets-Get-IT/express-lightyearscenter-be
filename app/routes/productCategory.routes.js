const router = require("express").Router();
const productCategoryController = require("../controllers/productCategory.controllers");

router.get("/", productCategoryController.getAllCategories);
router.post("/", productCategoryController.createCategory);
// router.put("/", OrderController.updateOrder);
// router.delete("/", OrderController.deleteOrder);

module.exports = router;
