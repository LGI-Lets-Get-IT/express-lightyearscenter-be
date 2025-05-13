const router = require("express").Router();
const fileController = require("../controllers/files.controllers");

router.get("/", fileController.getAll);
router.post("/upload/appointment", fileController.uploadAppointmentFile);
router.post(
  "/reports/daily-progress/generate",
  fileController.generateDailyProgressReport
);
router.post(
  "/reports/treatment-plan/generate/:id",
  fileController.generateTreatmentPlanReport
);

module.exports = router;
