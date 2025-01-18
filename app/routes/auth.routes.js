const router = require("express").Router();
const AuthController = require("../controllers/auth.controllers");

router.post("/login", AuthController.customerLogin);
router.post("/register", AuthController.customerRegister);
router.post('/google/login', AuthController.customerLoginWithGoogle);
router.post('/employee/login', AuthController.employeeLogin);
router.post('/logout', AuthController.userLogout);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

module.exports = router;
