


export const verificationEmail = (link: string, name: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Verify Your Email - P Collins</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #8B3A3A; color: white; padding: 20px; text-align: center;">
      <h1 style="margin: 0;">Verify Your Email</h1>
    </div>
    <div style="padding: 20px;">
      <h2>Hello ${name},</h2>
      <p>Thank you for registering with P Collins! Please verify your email address by clicking the link below:</p>
      <p style="text-align: center;">
        <a href="${link}" style="display: inline-block; padding: 12px 24px; background: #8B3A3A; color: white; text-decoration: none; border-radius: 5px;">Verify Email Address</a>
      </p>
      <p>Or copy and paste this link into your browser:</p>
      <p style="background: #f4f4f4; padding: 10px; word-break: break-all;">${link}</p>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account, you can safely ignore this email.</p>
    </div>
    <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
      <p>P Collins - Your trusted platform for marketplace, savings, and real estate.</p>
    </div>
  </div>
</body>
</html>
`;

export const welcomeEmail = (name: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to P Collins</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #8B3A3A; color: white; padding: 20px; text-align: center;">
      <h1 style="margin: 0;">Welcome to P Collins!</h1>
    </div>
    <div style="padding: 20px;">
      <h2>Hello ${name},</h2>
      <p>Thank you for joining P Collins! We're excited to have you on board.</p>
      <p>With P Collins, you can:</p>
      <ul>
        <li>🛒 Shop quality products from trusted vendors</li>
        <li>💰 Save towards your financial goals</li>
        <li>🏠 Find your dream property</li>
      </ul>
      <p>Get started today and explore all the features we have to offer.</p>
    </div>
    <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
      <p>P Collins - Your trusted platform for marketplace, savings, and real estate.</p>
    </div>
  </div>
</body>
</html>
`;

export const passwordResetEmail = (link: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #8B3A3A; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; text-align: center; }
    .button { display: inline-block; padding: 10px 20px; background: #8B3A3A; color: white; text-decoration: none; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Reset Your Password</h1>
    </div>
    <div class="content">
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      <a href="${link}" class="button">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, you can ignore this email.</p>
    </div>
  </div>
</body>
</html>
`;