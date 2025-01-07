module.exports = (app) => {
  const router = require("express").Router();
  const authController = require("../controllers/auth.controller");

  router.post("/login", authController.loginUser);
  router.post("/login/google", authController.loginWithGoogle);
  router.post("/register", authController.registerUser);
  router.post("/logout", authController.logoutUser);
  router.get("/token", authController.getRefreshToken);

  app.use("/", router);
};
