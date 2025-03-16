const router = require("express").Router();
const clientController = require("../controllers/clients.controllers");
const { validateInput } = require("../utils/inputValidator.utils");
const { clientSchema  } = require('../validators/clients.validators')

router.post("/", validateInput(clientSchema.create), clientController.create);
router.get("/", clientController.getAll);
router.get('/:clientId', validateInput(clientSchema.view), clientController.getById);
router.put('/:clientId', validateInput(clientSchema.update), clientController.updateById);
router.delete('/', validateInput(clientSchema.delete), clientController.deleteIds);

module.exports = router;
