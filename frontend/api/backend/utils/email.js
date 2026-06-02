const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendKeyEmail = async ({ to, subject, productName, keys, orderId, customerName }) => {
  const keyList = Array.isArray(keys) ? keys.join('<br>') : keys;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">PC Deals India</h2>
      <p>Dear ${customerName},</p>
      <p>Thank you for your purchase! Your product key(s) are ready:</p>
      <div style="background: #f0f4ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1e293b; margin-top: 0;">${productName}</h3>
        <p style="font-size: 18px; font-weight: bold; color: #2563eb;">${keyList}</p>
        <p style="color: #64748b; font-size: 14px;">Order ID: ${orderId}</p>
      </div>
      <p><strong>Next Steps:</strong></p>
      <ul>
        <li>Download your GST invoice from your account under "My Orders"</li>
        <li>For installation help, contact our support team</li>
      </ul>
      <p style="color: #94a3b8; font-size: 12px;">This is an automated email. Please do not reply.</p>
    </div>
  `;
  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
};

const sendGenericEmail = async ({ to, subject, html }) => {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
};

module.exports = { sendKeyEmail, sendGenericEmail, transporter };
