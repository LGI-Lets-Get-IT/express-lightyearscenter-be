const router = require("express").Router();
const treatmentTypesController = require("../controllers/treatmentTypes.controllers");

router.post("/", treatmentTypesController.create);
router.get("/", treatmentTypesController.getAll);
router.get("/:id", treatmentTypesController.getById);
router.put('/:id', treatmentTypesController.updateById)
router.delete("/", treatmentTypesController.deleteIds);

module.exports = router;
