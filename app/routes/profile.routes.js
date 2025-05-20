const router = require("express").Router();
const profileController = require('../controllers/profile.controllers')

router.get("/", profileController.getUserProfile);
router.put('/', profileController.editUserProfile);

module.exports = router;
