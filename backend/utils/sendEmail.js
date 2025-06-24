const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, 
  },
});


  await transporter.sendMail({
    from: `"StudentManagerPro" <${process.env.EMAIL_USERNAME}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
