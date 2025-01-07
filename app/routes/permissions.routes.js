module.exports = (app) => {
  const router = require("express").Router();
  const PermissionController = require("../controllers/permissions.controller");

  router.post("/verify-roles", PermissionController.verifyUserPermissions);

  app.use("/", router);
};
