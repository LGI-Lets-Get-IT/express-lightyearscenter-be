const customError = new Error();

const verifyPermission = (...requiredPermissions) => {
  return (req, res, next) => {
    try {
      if (!req.permissions) {
        customError.statusCode = 403;
        customError.message = "No permissions assigned to user";
        throw customError;
      }

      console.log("REQUIREDPERM", requiredPermissions);
      const hasPermission = req.permissions.some((perm) =>
        requiredPermissions.includes(perm)
      );
      if (!hasPermission) {
        customError.statusCode = 403;
        customError.message = "You are not authorized to perform this action";
        throw customError;
      }
      next();
    } catch (error) {
      res.jsonFailed(error?.statusCode, error?.message, error);
    }
  };
};

module.exports = verifyPermission;
