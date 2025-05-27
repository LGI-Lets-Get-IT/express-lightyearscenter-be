const router = require("express").Router();
const masterRoleController = require("../controllers/masterTreatments.controllers");

router.post("/", masterRoleController.create);
router.get("/", masterRoleController.getAll);
router.get("/:id", masterRoleController.getById);
router.put('/:id', masterRoleController.updateById)
router.delete("/", masterRoleController.deleteIds);

module.exports = router;
