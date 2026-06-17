


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

export const welcomeEmail = (name: string, role: string) => {
  // Role-specific content
  const roleContent = {
    USER: {
      title: "Welcome to P Collins!",
      features: [
        "Shop quality products from trusted vendors",
        "Save towards your financial goals",
        "Find your dream property",
        "Track your savings and investments"
      ],
      cta: "Start Shopping",
      ctaLink: "/products",
      additionalInfo: "Explore our marketplace, start saving, or browse properties today!"
    },
    AGENT: {
      title: "Welcome to P Collins Real Estate Agent Program!",
      features: [
        "List and manage properties for clients",
        "Receive and manage property inquiries",
        "Schedule property viewings and appointments",
        "Track your commissions and performance analytics",
        "Build your client base"
      ],
      cta: "List Your First Property",
      ctaLink: "/agent/properties/add",
      additionalInfo: "Start listing properties, connect with clients, and grow your real estate business today!"
    },
    LANDLORD: {
      title: "Welcome to P Collins Landlord Program!",
      features: [
        "List and manage your rental properties",
        "Find and manage tenants",
        "Track rent payments and earnings",
        "Manage maintenance requests",
        "View property performance analytics"
      ],
      cta: "List Your Property",
      ctaLink: "/landlord/properties/add",
      additionalInfo: "Start listing your properties, find reliable tenants, and maximize your rental income today!"
    },
    VENDOR: {
      title: "Welcome to P Collins Vendor Program!",
      features: [
        "List and manage your products",
        "Track inventory and sales analytics",
        "View your revenue and performance metrics",
        "Manage customer reviews and ratings",
        "Receive payouts directly to your wallet"
      ],
      cta: "Add Your First Product",
      ctaLink: "/vendor/products/add",
      additionalInfo: "Start selling your products, reach more customers, and grow your business today!"
    },
    ADMIN: {
      title: "Welcome to P Collins Admin Panel!",
      features: [
        "Manage all users and their roles",
        "View platform analytics and metrics",
        "Review and verify KYC submissions",
        "Manage properties and listings",
        "Manage products and inventory"
      ],
      cta: "Go to Dashboard",
      ctaLink: "/admin",
      additionalInfo: "Start managing the platform, review KYC submissions, and ensure smooth operations!"
    }
  };

  // Default to USER if role is not recognized
  const content = roleContent[role as keyof typeof roleContent] || roleContent.USER;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${content.title}</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    .header {
      background: linear-gradient(135deg, #8B3A3A, #6B2C2C);
      color: white;
      padding: 30px 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .header .role-badge {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      padding: 6px 16px;
      border-radius: 20px;
      margin-top: 10px;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .content {
      padding: 30px 25px;
      background: #ffffff;
    }
    .content h2 {
      color: #1A2A4F;
      margin-top: 0;
      font-size: 22px;
    }
    .content p {
      color: #555;
      margin-bottom: 16px;
    }
    .features {
      background: #f8fafc;
      border-radius: 8px;
      padding: 20px 25px;
      margin: 20px 0;
    }
    .features ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .features li {
      padding: 8px 0;
      color: #333;
      font-size: 15px;
      border-bottom: 1px solid #e8ecf0;
    }
    .features li:last-child {
      border-bottom: none;
    }
    .cta-button {
      display: inline-block;
      background: #8B3A3A;
      color: white !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0 10px;
      transition: background 0.3s ease;
    }
    .cta-button:hover {
      background: #6B2C2C;
    }
    .additional-info {
      background: #f0f7ff;
      border-left: 4px solid #8B3A3A;
      padding: 15px 20px;
      margin: 20px 0;
      border-radius: 0 6px 6px 0;
      color: #1A2A4F;
      font-size: 14px;
    }
    .additional-info strong {
      color: #8B3A3A;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #888;
      font-size: 12px;
      border-top: 1px solid #eee;
      background: #fafafa;
      border-radius: 0 0 8px 8px;
    }
    .footer a {
      color: #8B3A3A;
      text-decoration: none;
    }
    .footer-links {
      margin-top: 8px;
    }
    .footer-links a {
      color: #8B3A3A;
      text-decoration: none;
      margin: 0 8px;
    }
    .footer-links a:hover {
      text-decoration: underline;
    }
    @media only screen and (max-width: 480px) {
      .container {
        padding: 10px;
      }
      .header h1 {
        font-size: 22px;
      }
      .content {
        padding: 20px 15px;
      }
      .cta-button {
        display: block;
        text-align: center;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>${content.title}</h1>
      <div class="role-badge">${role}</div>
    </div>

    <!-- Content -->
    <div class="content">
      <h2>Hello ${name},</h2>
      <p>Thank you for joining P Collins! We're excited to have you on board as a <strong>${role}</strong>.</p>
      
      <p>With P Collins, you can:</p>
      <div class="features">
        <ul>
          ${content.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
      </div>

      <div style="text-align: center;">
        <a href="${process.env.WEB_URL || 'http://localhost:5173'}${content.ctaLink}" class="cta-button">
          ${content.cta}
        </a>
      </div>

      <div class="additional-info">
        <strong>Next Steps:</strong> ${content.additionalInfo}
      </div>

      <p style="margin-top: 20px; font-size: 14px; color: #666;">
        Need help? Contact our support team at <a href="mailto:support@pcollins.com" style="color: #8B3A3A;">support@pcollins.com</a>
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>P Collins - Your trusted platform for marketplace, savings, and real estate.</p>
      <div class="footer-links">
        <a href="${process.env.WEB_URL || 'http://localhost:5173'}/products">Marketplace</a>
        <a href="${process.env.WEB_URL || 'http://localhost:5173'}/savings">Savings</a>
        <a href="${process.env.WEB_URL || 'http://localhost:5173'}/properties">Real Estate</a>
      </div>
      <p style="margin-top: 12px; font-size: 11px;">
        &copy; ${new Date().getFullYear()} P Collins. All rights reserved.
      </p>
      <p style="font-size: 11px; color: #aaa;">
        This email was sent to you because you created an account on P Collins.
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

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