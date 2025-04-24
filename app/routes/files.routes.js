const router = require("express").Router();
const fileController = require("../controllers/files.controllers");

router.get("/", fileController.getAll);

module.exports = router;
