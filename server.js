require('./otel')
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
const { trace } = require('@opentelemetry/api');
// const { allowList } = require("./app/middlewares/allowList.middleware");
require("dotenv").config();
const tracer = trace.getTracer('lightyears-cdc-backend');

app.set("trust proxy", 1);
app.use(helmet());
// app.use(
//   rateLimit({
//     windowMs: 1 * 60 * 1000, // 1 minute
//     max: 50, // limit each IP to 50 requests per windowMs
//     message: "Too many requests, please try again later.",
//   })
// );
app.use(morgan("dev"));
app.use(messageHandler);
app.use(express.static("public"));
app.use(cors(corsOptions));
// app.use(credentials);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

const span = tracer.startSpan('manual-span');
span.setAttribute('debug', 'testing');
setTimeout(() => {
  span.end();
  console.log('Span finished');
}, 500);

app.get("/api/health-check", (req, res) => {
  const span = tracer.startSpan('say-hello');
  span.setAttribute('TEST', 'Good bro')

  span.end()
  res.status(200).json({
    message: `API is healthy and ready to serve.`,
  });
});

require("./app/routes")(app);


app.all("*", (req, res) => {
  res.status(404).json({
    message: `Endpoint ${req.path}, method ${req.method} not found`,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
