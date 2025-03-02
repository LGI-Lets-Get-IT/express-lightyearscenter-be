const router = require("express").Router();
const appointmentController = require("../controllers/appointments.controllers");

router.post("/", appointmentController.create);
router.get("/", appointmentController.getAll);
router.get('/:id', appointmentController.getById);
router.put('/:id', appointmentController.updateById);
router.delete('/', appointmentController.deleteIds);

module.exports = router;
