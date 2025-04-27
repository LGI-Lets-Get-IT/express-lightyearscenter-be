const path = require('path')
const fs = require('fs')
const handlebars = require('handlebars')
const puppeteer = require('puppeteer')

const generatePdf = async (templateName, data) => {
  const logoPath = path.join(__dirname, '../../public', 'TLY_LOGO_L.png');
  const logoBase64 = fs.readFileSync(logoPath, 'base64');
  const watermarkPath = path.join(__dirname, '../../public', 'TLY_ROCKET.png')
  const watermarkBase64 = fs.readFileSync(watermarkPath, 'base64')

  const templateHtml = fs.readFileSync(path.join(__dirname, '../../app/templates', `${templateName}.html`), 'utf8');
  const template = handlebars.compile(templateHtml);
  const finalHtml = template(data);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(finalHtml, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    // path: `${fileName}.pdf`,
    format: 'A4',
    margin: {
      top: '120px',
      bottom: '80px',
      left: '40px',
      right: '40px'
    },
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="display: flex; justify-content: space-between; align-items: center; width:100%; padding: 0 20px;">
        <img src="data:image/png;base64,${logoBase64}" style="width: auto;" alt="The Light Years Logo" />
        <div style="position: fixed; top: 30%; left: 25%;width: 50%;opacity: 0.1;z-index: 0; text-align: center; pointer-events: none;">
            <img src="data:image/png;base64,${watermarkBase64}" style="width: 600px; opacity: 0.3;" />
        </div>
        <div style="text-align: left; font-size: 12px; color: #2f2f91;">
          <div><strong>OFFICE</strong></div>
          <div>Jl. Prof. DR. Soepomo No.11A, RT.12/RW.3,</div>
          <div>Tebet Bar., Kec. Tebet, Kota Jakarta Selatan,</div>
          <div>DKI Jakarta 12810</div>
          <div>Email: admin@thelightyearscdc.com</div>
        </div>
      </div>
    `,
    footerTemplate: `
      <div style="font-size:10px; text-align:center; width:100%;">
        Page <span class="pageNumber"></span> of <span class="totalPages"></span>
      </div>
    `
  });

  await browser.close();

  console.log('✅ PDF Generated Successfully');
  return pdfBuffer
}

module.exports = {
    generatePdf
}