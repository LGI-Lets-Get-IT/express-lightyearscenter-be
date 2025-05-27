const {
  throwError,
  sendResponse,
  jsonFailed,
} = require("../utils/messageHandler.utils");
const { CLIENT_RESPONSE } = require("../constants/message.constant");

const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.roles) {
        throwError(CLIENT_RESPONSE.NOT_AUTHORIZED);
      }

      const rolesArr = [...allowedRoles];
      /*
                1. To compare the roles in request and the accepted/allowed roles to do some action
                2. If one of the value is true, then user is authorized, else not
            */
      const result = req.roles
        .map((role) => rolesArr.includes(role))
        .find((val) => val === true);
      if (!result) {
        throwError(CLIENT_RESPONSE.NOT_ALLOWED_ACTION);
      }
      next();
    } catch (error) {
      sendResponse(
        res,
        jsonFailed({ code: error.code, message: error.message }, error)
      );
    }
  };
};

module.exports = verifyRoles;
