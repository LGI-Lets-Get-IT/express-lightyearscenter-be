const router = require("express").Router();
const permissions = require("../constants/permissions.constant");
const employeeController = require("../controllers/employees.controllers");
const verifyPermission = require("../middlewares/verifyPermission.middleware");
const { validateInput } = require("../utils/inputValidator.utils");

router.post(
  "/",
  verifyPermission(permissions.EMPLOYEES.CREATE),
  employeeController.create
);
router.get(
  "/",
  verifyPermission(permissions.EMPLOYEES.VIEW),
  employeeController.getAll
);
// router.get("/psychologists", employeeController.getAllByRolePsychologist);
// router.get("/therapists", employeeController.getAllByRoleTherapist);
router.get(
  "/psychologists/availability",
  employeeController.getAllByRolePsychologistWithAvailability
);
router.get(
  "/therapists/availability",
  employeeController.getAllByRoleTherapistWithAvailability
);
router.get(
  "/:employeeId",
  verifyPermission(permissions.EMPLOYEES.VIEW),
  employeeController.getById
);
router.put(
  "/:employeeId",
  verifyPermission(permissions.EMPLOYEES.UPDATE),
  employeeController.updateById
);
router.put(
  "/:employeeId/change-password",
  verifyPermission(permissions.EMPLOYEES.UPDATE),
  employeeController.updatePasswordById
);
router.delete(
  "/",
  verifyPermission(permissions.EMPLOYEES.DELETE),
  employeeController.deleteIds
);

module.exports = router;
