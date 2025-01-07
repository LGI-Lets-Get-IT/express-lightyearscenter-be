const { UNAUTHORIZED } = require("../constants/httpStatusCode.constant");
const { sendResponse, jsonFailed } = require("../utils/messageHandler.utils");
const { CLIENT_RESPONSE } = require("../constants/message.constant");
const READ_ACCESS_API_KEY = process.env.READ_ACCESS_API_KEY;
const WRITE_ACCESS_API_KEY = process.env.WRITE_ACCESS_API_KEY;

const API_KEYS = {
  GET: READ_ACCESS_API_KEY,
  POST: WRITE_ACCESS_API_KEY,
  PUT: WRITE_ACCESS_API_KEY,
  DELETE: WRITE_ACCESS_API_KEY,
};

const leveledApiKeys = (req, res, next) => {
  const { "x-api-key": apiKey } = req.headers;

  if (apiKey !== API_KEYS[req.method]) {
    return sendResponse(res,jsonFailed({code: UNAUTHORIZED, message: {
        indonesian: "API Key tidak valid",
        english: "API Key is invalid",
      }}))
    // return sendResponse(res, jsonFailed(CLIENT_RESPONSE.NOT_AUTHORIZED));
  }

  next();
};

module.exports = { leveledApiKeys };
