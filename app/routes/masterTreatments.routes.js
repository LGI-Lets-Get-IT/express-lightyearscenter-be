const router = require("express").Router();
const masterTreatmentController = require("../controllers/masterTreatments.controllers");

router.post("/", masterTreatmentController.create);
router.get("/", masterTreatmentController.getAll);
router.get("/:id", masterTreatmentController.getById);
router.put('/:id', masterTreatmentController.updateById)
router.delete("/", masterTreatmentController.deleteIds);

module.exports = router;
