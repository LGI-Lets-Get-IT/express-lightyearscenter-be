const router = require("express").Router();
const notificationController = require("../controllers/clients.controllers");
const { validateInput } = require("../utils/inputValidator.utils");
const { clientSchema  } = require('../validators/clients.validators')

// router.post("/", validateInput(clientSchema.create), notificationController.create);
// router.get("/", notificationController.getAll);
// router.get('/:clientId', validateInput(clientSchema.view), notificationController.getById);
// router.put('/:clientId', validateInput(clientSchema.update), notificationController.updateById);
// router.delete('/', validateInput(clientSchema.delete), notificationController.deleteIds);

module.exports = router;
