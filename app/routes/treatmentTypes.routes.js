const router = require("express").Router();
const treatmentTypesController = require("../controllers/treatmentTypes.controllers");

router.post("/", treatmentTypesController.create);
router.get("/", treatmentTypesController.getAll);
router.get("/:treatmentTypeId", treatmentTypesController.getById);
router.put('/:treatmentTypeId', treatmentTypesController.updateById)
router.delete("/", treatmentTypesController.deleteIds);

module.exports = router;
