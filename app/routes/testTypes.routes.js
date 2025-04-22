const router = require("express").Router();
const testTypesController = require("../controllers/testTypes.controllers");

router.post("/", testTypesController.create);
router.get("/", testTypesController.getAll);
router.get("/:id", testTypesController.getById);
router.put('/:id', testTypesController.updateById)
router.delete("/", testTypesController.deleteIds);

module.exports = router;
