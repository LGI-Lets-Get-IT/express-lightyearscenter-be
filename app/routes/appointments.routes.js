const router = require("express").Router();
const permissions = require("../constants/permissions.constant");
const appointmentController = require("../controllers/appointments.controllers");
const verifyPermission = require("../middlewares/verifyPermission.middleware");
const { validateInput} = require("../utils/inputValidator.utils");
const { appointmentSchema } = require("../validators/appointments.validators");

router.post("/", verifyPermission(permissions.APPOINTMENTS.CREATE), validateInput(appointmentSchema.create), appointmentController.create);
router.get("/", verifyPermission(permissions.APPOINTMENTS.VIEW), appointmentController.getAll);
router.get('/programs', verifyPermission(permissions.APPOINTMENTS.VIEW), appointmentController.getForTreatmentProgress);
router.get('/assessments', verifyPermission(permissions.APPOINTMENTS.VIEW), appointmentController.getForAssessments);
router.get('/:appointmentId', verifyPermission(permissions.APPOINTMENTS.VIEW), appointmentController.getById);
router.put('/:appointmentId', verifyPermission(permissions.APPOINTMENTS.UPDATE), validateInput(appointmentSchema.update), appointmentController.updateById);
router.delete('/', verifyPermission(permissions.APPOINTMENTS.DELETE), appointmentController.deleteIds);

module.exports = router;
