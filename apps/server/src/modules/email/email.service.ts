import axios from "axios";

export class EmailService {
  async sendEmail(to: string, subject: string, html: string) {
    try {
    if (!to || !subject || !html) {
      console.error("❌ Missing email fields");
      return false;
    }

    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: process.env.EMAIL_FROM,
          name: process.env.APP_NAME || "My App",
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Email sent via Brevo");
    return true;
  } catch (error: any) {
    console.error(
      "❌ Brevo email error:",
      (error?.response?.data || error?.message) as string
    );
    return false;
  }
  }
}