const router = require("express").Router();
const dashboardController = require("../controllers/dashboard.controllers");

router.get("/", dashboardController.getDashboardData);

module.exports = router;
