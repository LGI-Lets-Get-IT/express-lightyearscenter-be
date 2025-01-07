module.exports = (app) => {
  const router = require("express").Router();

  router.get("/user", UserController.getUserInfo);

  app.use("/api");
};
