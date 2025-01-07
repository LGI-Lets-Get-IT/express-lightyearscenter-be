const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const corsOptions = require("./app/config/corsOptions.config.js");
const logger = require("./app/utils/logger.js");
const credentials = require("./app/middlewares/credentials.middleware.js");
const rateLimiter = require("./app/middlewares/rateLimiter.middleware.js");
// const { allowList } = require("./app/middlewares/allowList.middleware.js");
const {
  leveledApiKeys,
} = require("./app/middlewares/leveledApiKeys.middleware.js");

require("dotenv").config();
const PORT = process.env.APP_PORT;

app.use(logger.printLog());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middlewares
// app.use(credentials);
// app.use(cors(corsOptions));
app.use(helmet());
// app.use(allowList);
// app.use(rateLimiter);
// app.use(leveledApiKeys);

require("./app/routes/auth.routes.js")(app);
require("./app/routes/permissions.routes.js")(app);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
