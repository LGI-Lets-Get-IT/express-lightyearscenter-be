const express = require("express");
const cors = require("cors");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./app/apidocs/swagger.json");
const messageHandler = require("./app/utils/messageHandler.utils");

require("dotenv").config();

app.set("trust proxy", 1);
app.use(cors({ origin: "*" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(messageHandler);

if (process.env.NODE_ENV === "DEVELOPMENT") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

require("./app/routes")(app);

app.get("/api/health-check", (req, res) => {
  res.status(200).json(`API is healthy, running on port ${PORT}`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
