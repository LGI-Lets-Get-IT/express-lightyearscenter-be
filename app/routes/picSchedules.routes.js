const router = require("express").Router();
const permissions = require("../constants/permissions.constant");
const picScheduleController = require("../controllers/picSchedules.controllers");
const verifyPermission = require("../middlewares/verifyPermission.middleware");
const { validateInput } = require("../utils/inputValidator.utils");
const { assessmentSchema } = require("../validators/assessments.validators");

router.post(
  "/",
  verifyPermission(permissions.EMPLOYEES.CREATE),
  // validateInput(assessmentSchema.create),
  picScheduleController.create
);
router.get(
  "/",
  verifyPermission(permissions.EMPLOYEES.VIEW),
  picScheduleController.getAll
);
router.get(
  "/:employeeId",
  verifyPermission(permissions.EMPLOYEES.VIEW),
  // validateInput(assessmentSchema.view),
  picScheduleController.getByEmployeeId
);
router.put(
  "/:employeeId",
  verifyPermission(permissions.ASSESSMENTS.UPDATE),
  // validateInput(assessmentSchema.update),
  picScheduleController.updateByEmployeeId
);
router.delete(
  "/",
  verifyPermission(permissions.ASSESSMENTS.DELETE),
  // validateInput(assessmentSchema.delete),
  picScheduleController.deleteIds
);

module.exports = router;
