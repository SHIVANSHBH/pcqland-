const verificationEmail = (name, code) => ({
  subject: 'Verify your email - PC Deals India',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">PC Deals India</h2>
      <p>Dear ${name},</p>
      <p>Welcome! Please verify your email address using this code:</p>
      <div style="background: #f0f4ff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <span style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 8px;">${code}</span>
      </div>
      <p>This code expires in 10 minutes.</p>
      <p style="color: #94a3b8; font-size: 12px;">If you did not create an account, ignore this email.</p>
    </div>
  `,
});

const passwordResetEmail = (name, code) => ({
  subject: 'Reset your password - PC Deals India',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">PC Deals India</h2>
      <p>Dear ${name},</p>
      <p>You requested a password reset. Use this code to reset your password:</p>
      <div style="background: #f0f4ff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <span style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 8px;">${code}</span>
      </div>
      <p>This code expires in 10 minutes.</p>
      <p style="color: #94a3b8; font-size: 12px;">If you did not request this, ignore this email.</p>
    </div>
  `,
});

module.exports = { verificationEmail, passwordResetEmail };
