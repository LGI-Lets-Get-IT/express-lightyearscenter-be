const { decodeToken, generateAccessToken } = require("../utils/jwt.utils");
const permissionMapping = require('../config/rolePermissionsMapping.config')
const customError = new Error();

require("dotenv").config();

const verifyJwt = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    console.log('AUTHHEADER', authHeader)
    if (!authHeader?.startsWith("Bearer ")) {
      customError.statusCode = 404;
      customError.message = "No token provided or invalid token";
      throw customError;
    }
  
    const token = authHeader.split(" ")[1];
    const decodedToken = decodeToken(token, process.env.ACCESS_TOKEN_SECRET);
    if (decodedToken) {
      req.user = decodedToken._id;
      req.permissions = decodedToken.permissions;
      next();
    }
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error)
  }
};

module.exports = verifyJwt;
