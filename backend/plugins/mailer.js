const nodemailer = require('nodemailer');

let transporter;

function createTransporter() {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: process.env.MAIL_SECURE === 'true',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    }
    return transporter;
}

async function sendMail({ to, subject, text, html }) {
    const mailOptions = {
        from: process.env.MAIL_USER,
        to,
        subject,
        text,
        html,
    };
    const transporter = createTransporter();
    return transporter.sendMail(mailOptions);
}

module.exports = { sendMail };
