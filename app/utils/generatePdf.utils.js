const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");
const puppeteer = require("puppeteer");
const { differenceInYears, differenceInMonths } = require("date-fns");

const generatePdf = async (templateName, data) => {
  const logoPath = path.join(__dirname, "../../public", "TLY_LOGO_L.png");
  const logoBase64 = fs.readFileSync(logoPath, "base64");
  const watermarkPath = path.join(__dirname, "../../public", "TLY_ROCKET.png");
  const watermarkBase64 = fs.readFileSync(watermarkPath, "base64");

  const templateHtml = fs.readFileSync(
    path.join(__dirname, "../../app/templates", `${templateName}.html`),
    "utf8"
  );
  const template = handlebars.compile(templateHtml);
  let finalHtml = template(data);

  if (templateName === "TREATMENT_PLAN_REPORT") {
    const tncHtml = fs.readFileSync(
      path.join(__dirname, "../../app/templates", "TNC.html"),
      "utf8"
    );
    const tncTemplate = handlebars.compile(tncHtml);
    const tncContent = tncTemplate(data);
    finalHtml += `<div style="page-break-before: always;"></div>` + tncContent;
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  await page.setContent(finalHtml, { waitUntil: "networkidle0" });

  const years = differenceInYears(new Date(), data.client.dateOfBirth);
  const totalMonths = differenceInMonths(new Date(), data.client.dateOfBirth);
  const remainingMonths = totalMonths - years * 12;
  const pdfBuffer = await page.pdf({
    // path: `${fileName}.pdf`,
    format: "A4",
    margin: {
      top: "120px",
      bottom: "80px",
      left: "40px",
      right: "40px",
    },
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="display: flex; justify-content: space-between; align-items: center; width:100%; padding: 0 50px 0 50px;">
        <img src="data:image/png;base64,${logoBase64}" style="width: auto;" alt="The Light Years Logo" />
        <div style="position: fixed; top: 30%; left: 25%;width: 50%;opacity: 0.1;z-index: 0; text-align: center; pointer-events: none;">
            <img src="data:image/png;base64,${watermarkBase64}" style="width: 600px; opacity: 0.3;" />
        </div>
        <div style="text-align: left; font-weight: bold; font-size: 14px;">
          ${data.client.fullName}<br>
          ${years} YEARS, ${remainingMonths} MONTH
        </div>
      </div>
    `,
    footerTemplate: `
      <div style="font-size:10px; text-align:center; width:100%;">
        Call +62 851-8605-5162<br>
        Email <a href="mailto:admin@thelightyearscdc.com">admin@thelightyearscdc.com</a><br>
        Jl. Prof. DR. Soepomo No. 11A, RT.12/RW.3, Tebet Bar., Kec. Tebet,<br>
        Kota Jakarta Selatan, Daerah Khusus Ibukuota Jakarta 12810<br>
      </div>
    `,
  });

  await browser.close();

  console.log("✅ PDF Generated Successfully");
  return pdfBuffer;
};

module.exports = {
  generatePdf,
};
