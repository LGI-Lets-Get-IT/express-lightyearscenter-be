const router = require("express").Router();
const appointmentController = require("../controllers/appointments.controllers");
const { validateInput} = require("../utils/inputValidator.utils");
const { appointmentSchema } = require("../validators/appointments.validators");

router.post("/", validateInput(appointmentSchema.create), appointmentController.create);
router.get("/", appointmentController.getAll);
router.get('/:appointmentId', appointmentController.getById);
router.put('/:appointmentId', validateInput(appointmentSchema.update), appointmentController.updateById);
router.delete('/', validateInput(appointmentSchema.delete), appointmentController.deleteIds);

module.exports = router;
