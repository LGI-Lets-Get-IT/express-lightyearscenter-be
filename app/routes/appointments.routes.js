const router = require("express").Router();
const appointmentController = require("../controllers/appointments.controllers");
const { validateInput} = require("../utils/inputValidator.utils");
const { appointmentSchema } = require("../validators/appointments.validators");

router.post("/", validateInput(appointmentSchema.create), appointmentController.create);
router.get("/", appointmentController.getAll);
router.get('/:id', appointmentController.getById);
router.put('/:id', validateInput(appointmentSchema.update), appointmentController.updateById);
router.delete('/', appointmentController.deleteIds);

module.exports = router;
