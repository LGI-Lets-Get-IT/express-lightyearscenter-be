const router = require("express").Router();
const fileController = require("../controllers/files.controllers");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.get("/", fileController.getAll);
router.post("/", upload.single("file"), fileController.uploadFile);
router.post(
  "/reports/daily-progress/generate/:id",
  fileController.generateDailyProgressReport
);
router.post(
  "/reports/treatment-plan/generate/:id",
  fileController.generateTreatmentPlanReport
);
router.post(
  "/reports/daily-progress/send-mail/:id",
  fileController.sendMailDailyProgressReport
);
router.post(
  "/reports/treatment-plan/send-mail/:id",
  fileController.sendMailTreatmentPlanReport
);

module.exports = router;
