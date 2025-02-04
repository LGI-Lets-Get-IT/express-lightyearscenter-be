const router = require("express").Router();
const ingredientController = require("../controllers/ingredients.controllers");

router.get("/", ingredientController.getAllIngredients);
router.get("/:id", ingredientController.getIngredientById);
router.post("/", ingredientController.createIngredient);
router.put('/:id', ingredientController.updateIngredientById)
// router.put("/", OrderController.updateOrder);
// router.delete("/", OrderController.deleteOrder);

module.exports = router;
