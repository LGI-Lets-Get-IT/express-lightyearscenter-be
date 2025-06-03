const router = require("express").Router();
const authController = require("../controllers/auth.controllers");
const verifyJwt = require("../middlewares/verifyJwt.middleware");
const { validateInput } = require("../utils/inputValidator.utils");
const { authSchema } = require("../validators/auth.validators");

router.post("/login", validateInput(authSchema.login), authController.userLogin);
router.post('/logout', authController.userLogout);
router.get('/refresh-token', authController.userRefreshToken);
router.put('/change-password', verifyJwt, authController.changePassword);
// router.post("/forgot-password", authController.forgotPassword);
// router.post("/reset-password", authController.resetPassword);

module.exports = router;
