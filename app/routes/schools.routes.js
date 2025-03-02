const router = require("express").Router();
const schoolController = require("../controllers/schools.controllers");
const { validateInput } = require("../utils/inputValidator.utils");
const { schoolSchema } = require("../validators/schools.validators");
// const { validateInput } = require("../utils/inputValidator.utils");
// const { productSchema } = require("../validators/products.validators");

router.get("/", schoolController.getAll);
router.get('/:id', validateInput(schoolSchema.view), schoolController.getById);
router.post("/", validateInput(schoolSchema.create), schoolController.create);
router.put("/:id", validateInput(schoolSchema.update), schoolController.updateById);
router.delete("/:id", schoolController.deleteIds);

module.exports = router;