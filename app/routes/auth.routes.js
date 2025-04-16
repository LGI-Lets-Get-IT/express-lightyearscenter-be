const router = require("express").Router();
const authController = require("../controllers/auth.controllers");

router.post("/login", authController.userLogin);
router.post('/logout', authController.userLogout);
// router.post("/forgot-password", authController.forgotPassword);
// router.post("/reset-password", authController.resetPassword);

module.exports = router;
