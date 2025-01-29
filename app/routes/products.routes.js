const router = require("express").Router();
const productController = require("../controllers/products.controllers");
const { validateInput } = require("../utils/inputValidator.utils");
const productSchema = require("../validators/products.validators");

router.get("/", productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post("/", validateInput(productSchema.create), productController.createProduct);
// router.put("/", OrderController.updateOrder);
// router.delete("/", OrderController.deleteOrder);

module.exports = router;
