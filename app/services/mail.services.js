const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const sendMail = async (
  recipient,
  subject,
  templateName,
  data,
  attachments
) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.resend.com",
    secure: true,
    port: 465,
    auth: {
      user: process.env.AUTH_USER_RESEND,
      pass: process.env.AUTH_PASS_RESEND,
    },
  });

  const logoPath = path.join(__dirname, "../../public/TLY_LOGO_L.png");
  const logoBase64 = fs.readFileSync(logoPath, "base64");

  const filePath = path.join("app/templates", `${templateName}.html`);
  const htmlTemplate = fs.readFileSync(filePath, "utf8");

  const compiledTemplate = handlebars.compile(htmlTemplate);
  const content = compiledTemplate({
    ...data,
    logoUrl: logoBase64,
  });

  const emailSent = await transporter.sendMail({
    from: '"The Light Years CDC" <admin@thelightyearscdc.com>',
    to: recipient,
    subject: subject,
    html: content,
    attachments,
  });
};

module.exports = {
  sendMail,
};
