const nodemailer = require('nodemailer')
const handlebars = require('handlebars')
const fs = require('fs').promises;
const path = require('path')

const sendMail = async (recipient, subject, templateName, data) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.resend.com',
        secure: true,
        port: 465,
        auth: {
            user: process.env.AUTH_USER_RESEND,
            pass: process.env.AUTH_PASS_RESEND,
        },
    });

    const logoPath = path.join(__dirname, "../../public", "TLY_LOGO_L.png");
    const logoBase64 = fs.readFile(logoPath, "base64");

    const filePath = path.join('app/templates', `${templateName}.html`);
    const htmlTemplate = await fs.readFile(filePath, 'utf8');

    const compiledTemplate = handlebars.compile(htmlTemplate);
    const content = compiledTemplate({...data, logoBase64 });

    const emailSent = await transporter.sendMail({
        from: '"The Lightyears CDC" <info@thelightyearscdc.com>',
        to: recipient,
        subject: subject,
        html: content
    })

    console.log('emailSent', emailSent)

}

module.exports = {
    sendMail
}