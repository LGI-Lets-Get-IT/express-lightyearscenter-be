const router = require("express").Router();
const permissions = require("../constants/permissions.constant");
const schoolController = require("../controllers/schools.controllers");
const verifyPermission = require("../middlewares/verifyPermission.middleware");
const { validateInput } = require("../utils/inputValidator.utils");
const { schoolSchema } = require("../validators/schools.validators");

router.get("/", verifyPermission(permissions.SCHOOLS.VIEW), schoolController.getAll);
router.get('/:schoolId', verifyPermission(permissions.SCHOOLS.VIEW),validateInput(schoolSchema.view), schoolController.getById);
// router.get('/:schoolId/clients', schoolController.getSchoolClientsById);
router.post("/", verifyPermission(permissions.SCHOOLS.CREATE), validateInput(schoolSchema.create), schoolController.create);
router.put("/:id", verifyPermission(permissions.SCHOOLS.UPDATE), validateInput(schoolSchema.update), schoolController.updateById);
router.delete("/", verifyPermission(permissions.SCHOOLS.DELETE), validateInput(schoolSchema.delete), schoolController.deleteIds);

module.exports = router;