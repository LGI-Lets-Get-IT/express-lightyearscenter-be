const router = require("express").Router();
const permissions = require("../constants/permissions.constant");
const assessmentController = require("../controllers/assessments.controllers");
const verifyPermission = require("../middlewares/verifyPermission.middleware");
const { validateInput } = require("../utils/inputValidator.utils");
const { assessmentSchema } = require("../validators/assessments.validators");

router.post(
  "/",
  verifyPermission(permissions.ASSESSMENTS.CREATE),
  assessmentController.create
);
router.get(
  "/",
  verifyPermission(permissions.ASSESSMENTS.VIEW),
  assessmentController.getAll
);
router.get(
  "/:assessmentId",
  verifyPermission(permissions.ASSESSMENTS.VIEW),
  validateInput(assessmentSchema.view),
  assessmentController.getById
);
router.put(
  "/:assessmentId",
  verifyPermission(permissions.ASSESSMENTS.UPDATE),
  validateInput(assessmentSchema.update),
  assessmentController.updateById
);
router.delete(
  "/",
  verifyPermission(permissions.ASSESSMENTS.DELETE),
  validateInput(assessmentSchema.delete),
  assessmentController.deleteIds
);

module.exports = router;
