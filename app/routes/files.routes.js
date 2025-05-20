const router = require("express").Router();
const fileController = require("../controllers/files.controllers");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", fileController.getAll);
router.post("/upload", upload.single('file'), fileController.uploadFile);
router.post(
  "/reports/daily-progress/generate",
  fileController.generateDailyProgressReport
);
router.post(
  "/reports/treatment-plan/generate/:id",
  fileController.generateTreatmentPlanReport
);

module.exports = router;
