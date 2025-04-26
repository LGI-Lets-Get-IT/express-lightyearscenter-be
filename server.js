const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const app = express();
const swaggerDocs = require("./app/apidocs/swagger.json");
const messageHandler = require("./app/utils/messageHandler.utils");
const credentials = require("./app/middlewares/credentials.middleware");
const corsOptions = require("./app/config/corsOptions.config");
const { allowList } = require("./app/middlewares/allowList.middleware");
const morgan = require("morgan");
const htmlPdf = require('html-pdf-node')
const path = require('path')
const fs = require('fs')
const handlebars = require('handlebars')
require("dotenv").config();

app.set("trust proxy", 1);
app.use(morgan("dev"));
app.use(messageHandler);
app.use(express.static('public'))
// app.use(cors(corsOptions));
// app.use(credentials);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === "DEVELOPMENT") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

require("./app/routes")(app);

const headerTemplate = `
  <div style="display: flex; justify-content: space-between; align-items: flex-start;">
    <div style="display: flex; flex-direction: column;">
      <img src="http://localhost:3344/TLY_LOGO_L.png" style="width: auto;" alt="TEST Logo" />
    </div>
    <div style="text-align: right; font-size: 12px; color: #2f2f91;">
      <div><strong>OFFICE</strong></div>
      <div>Jl. Prof. DR. Soepomo No.11A, RT.12/RW.3,</div>
      <div>Tebet Bar., Kec. Tebet, Kota Jakarta Selatan,</div>
      <div>DKI Jakarta 12810</div>
      <div>Email: admin@thelightyearscdc.com</div>
    </div>
  </div>
`

const htmlContent = `
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Daily Progress Report</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      background-color: #fff;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .logo {
      display: flex;
      flex-direction: column;
    }

    .logo img {
      width: auto;
    }

    .title {
      font-size: 20px;
      font-weight: bold;
      color: #2f2f91;
      margin: 5px 0;
    }

    .office {
      text-align: right;
      font-size: 12px;
      color: #2f2f91;
    }

    .email {
      color: #6e6e6e;
    }

    h2 {
      text-align: center;
      margin-top: 40px;
    }

    .info {
      margin-top: 30px;
      margin-bottom: 20px;
      font-size: 14px;
    }

    .info p {
      margin: 5px 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      margin-top: 10px;
    }

    th, td {
      border: 1px solid #999;
      padding: 12px;
      text-align: left;
      font-size: 14px;
      vertical-align: top;
      word-wrap: break-word;
    }

    th:nth-child(1),
    td:nth-child(1) {
      width: 33.333%;
    }

    th:nth-child(2),
    td:nth-child(2) {
      width: 33.333%;
    }

    th:nth-child(3),
    td:nth-child(3) {
      width: 33.333%;
    }

    th {
      background-color: #f0f0f0;
    }

    .example {
      font-style: italic;
      color: #555;
    }
  </style>
</head>
<body>
  <div style="display: flex; justify-content: space-between; align-items: flex-start;">
    <div style="display: flex; flex-direction: column;">
      <img src="http://localhost:3344/TLY_LOGO_L.png" style="width: auto;" alt="TEST Logo" />
    </div>
    <div style="text-align: right; font-size: 12px; color: #2f2f91;">
      <div><strong>OFFICE</strong></div>
      <div>Jl. Prof. DR. Soepomo No.11A, RT.12/RW.3,</div>
      <div>Tebet Bar., Kec. Tebet, Kota Jakarta Selatan,</div>
      <div>DKI Jakarta 12810</div>
      <div>Email: admin@thelightyearscdc.com</div>
    </div>
  </div>
  <h2>DAILY PROGRESS REPORT</h2>

  <div class="info">
    <p>Date: x/x/xxxx</p>
    <p>Client Name: {{ clientName }}</p>
    <p>Session: {{ currentSession }}</p>
    <p>TIC: xx</p>
  </div>

  <table>
    <tr>
      <th>Short-term goals</th>
      <th>Activities</th>
      <th>Progress</th>
    </tr>
    <tr>
      <td class="example">Example, Help a friend</td>
      <td>Folding origami paper into a paper plane</td>
      <td>XYZ was able to help a friend twice when they needed help, however, the teacher still needs to tell him to help.</td>
    </tr>
    <tr>
      <td>Objective #1</td>
      <td>Activities #1</td>
      <td>Note #1</td>
    </tr>
    <tr>
      <td>Objective #2</td>
      <td>Activities #2</td>
      <td>Note #2</td>
    </tr>
  </table>
</body>
</html>
`

const testData = {
  clientName: 'Testing ABC',
  currentSession: 2
}
app.get('/download-pdf', (req, res) => {
  const template = handlebars.compile(htmlContent);
  const finalHtml = template(testData);
  htmlPdf.generatePdf({
    content: finalHtml
  }, {
    format: 'A4',
    displayHeaderFooter: true,
    headerTemplate: headerTemplate,
    
  })
.then((res) => {
  console.log('RES', res)
  fs.writeFileSync(path.join(__dirname, 'OUTPUT.pdf'), res)
  })
})

app.get("/api/health-check", (req, res) => {
  res.status(200).json({
    message: `API is healthy and ready to serve.`,
  });
});

app.all("*", (req, res) => {
  res.status(404).json({
    message: "Endpoint not found",
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
