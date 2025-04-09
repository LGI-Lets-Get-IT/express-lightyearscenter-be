const router = require("express").Router();
const authController = require("../controllers/auth.controllers");

router.post("/login", authController.customerLogin);
router.post("/register", authController.customerRegister);
router.post('/google/login', authController.customerLoginWithGoogle);
router.post('/employee/login', authController.employeeLogin);
router.post('/logout', authController.userLogout);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
