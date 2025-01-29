const router = require("express").Router();
const productCategoryController = require("../controllers/productCategory.controllers");

router.get("/", productCategoryController.getAllCategories);
router.get("/:id", productCategoryController.getCategoryById);
router.post("/", productCategoryController.createCategory);
// router.put('/:id', productCategoryController)
// router.delete("/", OrderController.deleteOrder);

module.exports = router;
