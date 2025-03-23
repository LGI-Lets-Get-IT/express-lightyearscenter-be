const router = require("express").Router();
const clientController = require("../controllers/clients.controllers");
const { validateInput } = require("../utils/inputValidator.utils");
const { clientSchema  } = require('../validators/clients.validators')

router.post("/", validateInput(clientSchema.create), clientController.create);
router.get("/", clientController.getAll);
router.get('/:clientUuid', validateInput(clientSchema.view), clientController.getByUuid);
router.get('/:clientUuid/appointments', validateInput(clientSchema.view), clientController.getClientAppointmentsByUuid);
router.put('/:clientUuid', validateInput(clientSchema.update), clientController.updateByUuid);
router.delete('/', validateInput(clientSchema.delete), clientController.deleteIds);

module.exports = router;
