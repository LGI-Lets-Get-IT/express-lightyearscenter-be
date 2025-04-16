const router = require("express").Router();
const permissions = require("../constants/permissions.constant");
const clientController = require("../controllers/clients.controllers");
const verifyPermission = require("../middlewares/verifyPermission.middleware");
const { validateInput } = require("../utils/inputValidator.utils");
const { clientSchema  } = require('../validators/clients.validators')

router.post("/", verifyPermission(permissions.CLIENTS.CREATE), validateInput(clientSchema.create), clientController.create);
router.get("/", verifyPermission(permissions.CLIENTS.VIEW), clientController.getAll);
router.get('/:clientUuid', verifyPermission(permissions.CLIENTS.VIEW), validateInput(clientSchema.view), clientController.getByUuid);
router.get('/:clientUuid/appointments', verifyPermission(permissions.CLIENTS.VIEW), validateInput(clientSchema.view), clientController.getClientAppointmentsByUuid);
router.put('/:clientUuid', verifyPermission(permissions.CLIENTS.UPDATE), validateInput(clientSchema.update), clientController.updateByUuid);
router.delete('/', verifyPermission(permissions.CLIENTS.DELETE), validateInput(clientSchema.delete), clientController.deleteIds);

module.exports = router;
