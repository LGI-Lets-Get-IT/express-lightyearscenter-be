const allowList = (req, res, next) => {
  const allowedIps = process.env.ALLOWED_ORIGINS
  const incomingIp = req.ip.split("::ffff:")[1] || "::1";
  if (!allowedIps.includes(incomingIp)) {
    return res.jsonFailed(403, "Forbidden access!")
  }
  return next();
};

module.exports = { allowList };
