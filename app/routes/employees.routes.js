const router = require("express").Router();
const employeeController = require("../controllers/employees.controllers");

router.post("/", employeeController.create);
router.get("/", employeeController.getAll);
router.get('/psychologists', employeeController.getAllByRolePsychologist)
router.get('/therapists', employeeController.getAllByRoleTherapist);
router.get("/:employeeId", employeeController.getById);
router.put('/:employeeId', employeeController.updateById)
router.delete("/", employeeController.deleteIds);

module.exports = router;
