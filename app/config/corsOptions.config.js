const { isAllowedOrigin } = require('./allowedOrigins.config')

const corsOptions = {
  origin: (origin, callback) => {
    // No Origin header = not a cross-site browser request (curl, server-to-server).
    callback(null, !origin || isAllowedOrigin(origin));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
