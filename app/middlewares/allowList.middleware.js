const { SERVER_RESPONSE } = require("../constants/message.constant");
const { sendResponse, jsonFailed } = require("../utils/messageHandler.utils");

const ALLOWED_IPS = JSON.parse(process.env.ALLOWED_IP_ADDR);

const allowList = (req, res, next) => {
  console.log("REQ.IP", req.ip);
  const incomingIp = req.ip.split("::ffff:")[1] || "::1";
  if (!ALLOWED_IPS.includes(incomingIp)) {
    return sendResponse(res, jsonFailed(SERVER_RESPONSE.INTERNAL_SERVER_ERROR));
  }
  next();
};

module.exports = { allowList };
