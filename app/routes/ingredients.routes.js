const router = require("express").Router();
const ingredientController = require("../controllers/ingredients.controllers");

router.get("/", ingredientController.getAllIngredients);
router.post("/", ingredientController.createIngredient);
// router.put("/", OrderController.updateOrder);
// router.delete("/", OrderController.deleteOrder);

module.exports = router;
