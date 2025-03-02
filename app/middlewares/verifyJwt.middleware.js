const { decodeToken } = require("../utils/jwt.utils");
const {
  throwError,
  sendResponse,
  jsonFailed,
} = require("../utils/messageHandler.utils");
const { CLIENT_RESPONSE } = require("../constants/message.constant");

require("dotenv").config();

const verifyJWT = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throwError(CLIENT_RESPONSE.INVALID_TOKEN);
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = decodeToken(token, process.env.ACCESS_TOKEN_SECRET);
    if (decodedToken) {
      req.user = decodedToken._id;
      req.groups = decodedToken.groups;
      req.permissions = decodedToken.permissions;
      next();
    }
  } catch (error) {
    sendResponse(
      res,
      jsonFailed({ code: error.code, message: error.message }, error)
    );
  }
};

module.exports = verifyJWT;
