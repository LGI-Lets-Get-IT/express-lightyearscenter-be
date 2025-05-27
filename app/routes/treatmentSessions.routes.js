const router = require("express").Router();
const treatmentSessionController = require("../controllers/treatmentSessions.controllers");
const { validateInput } = require("../utils/inputValidator.utils");
const { treatmentSessionSchema } = require("../validators/treatmentSession.validators");

router.post("/", validateInput(treatmentSessionSchema.create), treatmentSessionController.create);
router.get("/", treatmentSessionController.getAll);
router.get('/:planId', validateInput(treatmentSessionSchema.view), treatmentSessionController.getById);
router.put('/:planId', validateInput(treatmentSessionSchema.update), treatmentSessionController.updateById);
router.delete('/', validateInput(treatmentSessionSchema.delete), treatmentSessionController.deleteById);

module.exports = router;
