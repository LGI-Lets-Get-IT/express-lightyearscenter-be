const { CLIENT_RESPONSE } = require("../constants/message.constant");
const { decodeToken } = require("../utils/jwt.utils");
const {
  sendResponse,
  jsonFailed,
  throwError,
  jsonSuccess,
} = require("../utils/messageHandler.utils");

const verifyUserPermissions = (req, res) => {
  try {
    const requiredRoles = req.body.roles;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    console.log("token", authHeader);

    const token = authHeader.split(" ")[1];

    const userRoles = decodeToken(token, process.env.ACCESS_TOKEN_SECRET);

    console.log("USERROLES", userRoles.permissions);
    console.log("REQUIRED ROLES", requiredRoles);
    if (!userRoles.permissions.includes(...requiredRoles)) {
      console.log("TIDAK PUNYA AKSES");
      throwError(CLIENT_RESPONSE.NOT_ALLOWED_ACTION);
    }
    console.log("BERHASIL");

    sendResponse(
      res,
      jsonSuccess({
        code: 200,
        message: { indonesian: "Berhasil", english: "Success" },
      })
    );
  } catch (err) {
    sendResponse(
      res,
      jsonFailed({ code: err.code, message: err.message }, err)
    );
  }
};

module.exports = {
  verifyUserPermissions,
};
