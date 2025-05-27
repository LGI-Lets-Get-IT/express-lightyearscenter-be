const router = require("express").Router();
const testTypesController = require("../controllers/testTypes.controllers");

router.post("/", testTypesController.create);
router.get("/", testTypesController.getAll);
router.get("/:testTypeId", testTypesController.getById);
router.put('/:testTypeId', testTypesController.updateById)
router.delete("/", testTypesController.deleteIds);

module.exports = router;
