const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./app/apidocs/swagger.json");
const messageHandler = require("./app/utils/messageHandler.utils");
const credentials = require("./app/middlewares/credentials.middleware");
const corsOptions = require("./app/config/corsOptions.config");
// const { allowList } = require("./app/middlewares/allowList.middleware");
require("dotenv").config();

app.set("trust proxy", 1);
app.use(helmet());
// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 50, // limit each IP to 50 requests per windowMs
//     message: "Too many requests from this IP, please try again later.",
//   })
// );
app.use(morgan("dev"));
app.use(messageHandler);
app.use(express.static("public"));
app.use(cors(corsOptions));
app.use(credentials);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === "DEVELOPMENT") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

require("./app/routes")(app);

app.get("/api/health-check", (req, res) => {
  res.status(200).json({
    message: `API is healthy and ready to serve.`,
  });
});

app.all("*", (req, res) => {
  res.status(404).json({
    message: `Endpoint ${req.path}, method ${req.method} not found`,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
