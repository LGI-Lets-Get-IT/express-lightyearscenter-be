const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const customError = new Error();

require("dotenv").config();

/**
 * Generate an access token.
 *
 * @param {Object} payload - The payload to be encoded in the token.
 * @param {Object} options - The options for the token.
 * @param {string} options.expiresIn - The expiration time of the token.
 * @returns {string} The access token.
 * @throws {Error} If the environment variable for the access token secret is not set.
 */
const generateAccessToken = (payload) => {
  // Check if the environment variable for the access token secret is set
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET environment variable not set");
  }

  // Sign the payload with the access token secret and options
  return jwt.sign(payload, `${process.env.ACCESS_TOKEN_SECRET}`, { expiresIn: '5m'});
};

/**
 * Generate a refresh token.
 *
 * @param {Object} payload - The payload to be encoded in the token.
 * @param {Object} options - The options for the token.
 * @param {string} options.expiresIn - The expiration time of the token.
 * @returns {string} The refresh token.
 * @throws {Error} If the environment variable for the refresh token secret is not set.
 */
const generateRefreshToken = (payload) => {
  // Check if the environment variable for the refresh token secret is set
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET environment variable not set");
  }

  // Sign the payload with the refresh token secret and options
  return jwt.sign(payload, `${process.env.REFRESH_TOKEN_SECRET}`, { expiresIn: '60m'});
};

/**
 * Decodes a JSON Web Token using the specified secret key.
 * Throws an error if the token is invalid.
 *
 * @param {string} token - The JSON Web Token to decode.
 * @param {string} secretKey - The secret key used to sign the token.
 * @returns {Object} The decoded token payload.
 * @throws {Error} If the token is invalid.
 */
const decodeToken = (token, secretKey) => {
  const decodedToken = jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      customError.statusCode = 401;
      customError.message = "Token expired";
      throw customError;
    }

    return decoded;
  });

  return decodedToken;
};
module.exports = {
  generateAccessToken,
  generateRefreshToken,
  decodeToken,
};
