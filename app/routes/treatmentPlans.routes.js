const router = require("express").Router();
const treatmentPlanController = require("../controllers/clients.controllers");
const { validateInput } = require("../utils/inputValidator.utils");
const { clientSchema  } = require('../validators/clients.validators')

router.post("/", validateInput(clientSchema.create), treatmentPlanController.create);
router.get("/", treatmentPlanController.getAll);
router.get('/:clientUuid', validateInput(clientSchema.view), treatmentPlanController.getByUuid);
router.get('/:clientUuid/appointments', validateInput(clientSchema.view), treatmentPlanController.getClientAppointmentsByUuid);
router.put('/:clientUuid', validateInput(clientSchema.update), treatmentPlanController.updateByUuid);
router.delete('/', validateInput(clientSchema.delete), treatmentPlanController.deleteIds);

module.exports = router;
