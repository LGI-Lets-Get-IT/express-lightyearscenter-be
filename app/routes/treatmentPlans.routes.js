const router = require("express").Router();
const treatmentPlanController = require("../controllers/treatmentPlans.controllers");
const { validateInput } = require("../utils/inputValidator.utils");
const { treatmentPlanSchema } = require("../validators/treatmentPlans.validators");

router.post("/", validateInput(treatmentPlanSchema.create), treatmentPlanController.create);
router.get("/", treatmentPlanController.getAll);
router.get('/:planId', validateInput(treatmentPlanSchema.view), treatmentPlanController.getById);
router.put('/:planId', treatmentPlanController.updateById);
router.delete('/', validateInput(treatmentPlanSchema.delete), treatmentPlanController.deleteByIds);

module.exports = router;
