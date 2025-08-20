const router = require("express").Router();
const permissions = require("../constants/permissions.constant");
const clientController = require("../controllers/clients.controllers");
const verifyPermission = require("../middlewares/verifyPermission.middleware");
const { validateInput } = require("../utils/inputValidator.utils");
const { clientSchema } = require("../validators/clients.validators");

router.post(
  "/",
  verifyPermission(permissions.CLIENTS.CREATE),
  validateInput(clientSchema.create),
  clientController.create
);
router.get(
  "/",
  verifyPermission(permissions.CLIENTS.VIEW),
  clientController.getAll
);
router.get(
  "/:clientUuid",
  verifyPermission(permissions.CLIENTS.VIEW),
  validateInput(clientSchema.view),
  clientController.getByUuid
);
router.put(
  "/:clientUuid/intake-form",
  verifyPermission(permissions.CLIENTS.UPDATE),
  validateInput(clientSchema.updateIntakeFormLink),
  clientController.updateIntakeFormLinkByUuid
);
router.put(
  "/:clientUuid",
  verifyPermission(permissions.CLIENTS.UPDATE),
  validateInput(clientSchema.update),
  clientController.updateByUuid
);
router.put(
  "/:clientUuid/change-password",
  verifyPermission(permissions.CLIENTS.UPDATE),
  validateInput(clientSchema.updatePassword),
  clientController.updatePasswordByUuid
);
router.delete(
  "/",
  verifyPermission(permissions.CLIENTS.DELETE),
  validateInput(clientSchema.delete),
  clientController.deleteByUuids
);

module.exports = router;
