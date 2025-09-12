const { decodeToken, generateAccessToken } = require("../utils/jwt.utils");
const permissionMapping = require("../config/rolePermissionsMapping.config");
const customError = new Error();

require("dotenv").config();

const verifyJwt = (req, res, next) => {
  try {
    // FIXED: Get token from HTTP-only cookie instead of Authorization header
    const token = req.cookies.accessToken;

    // OLD CODE - commented out
    // const authHeader = req.headers.authorization || req.headers.Authorization;
    // if (!authHeader?.startsWith("Bearer ")) {
    //   customError.statusCode = 401;
    //   customError.message = "Invalid token provided";
    //   throw customError;
    // }
    // const token = authHeader.split(" ")[1];

    if (!token) {
      customError.statusCode = 401;
      customError.message = "No access token provided";
      throw customError;
    }

    const decodedToken = decodeToken(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      "access"
    );
    if (decodedToken) {
      req.user = {
        id: decodedToken.id,
        fullName: decodedToken.fullName,
        email: decodedToken.email,
        ...(decodedToken?.role && { role: decodedToken.role }),
      };
      req.permissions = decodedToken.permissions;
      next();
    }
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

module.exports = verifyJwt;
