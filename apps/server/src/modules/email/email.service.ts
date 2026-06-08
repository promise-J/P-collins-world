import { BrevoClient } from "@getbrevo/brevo";

// Initialize Brevo with proper configuration
const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY!,
});

export class EmailService {
  async sendEmail(to: string, subject: string, html: string) {
    try {
      // Validate required environment variables
      if (!process.env.EMAIL_FROM) {
        throw new Error("EMAIL_FROM environment variable is not set");
      }
      
      if (!process.env.BREVO_API_KEY) {
        throw new Error("BREVO_API_KEY environment variable is not set");
      }

      const response = await brevo.transactionalEmails.sendTransacEmail({
        sender: {
          email: process.env.EMAIL_FROM,
          name: process.env.EMAIL_FROM_NAME || "P Collins",
        },
        to: [
          {
            email: to,
            name: to.split('@')[0], // Extract name from email
          },
        ],
        subject: subject,
        htmlContent: html,
        // Optional: Add text content as fallback
        textContent: html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
      });

      return response;
    } catch (error: any) {
      console.error("Brevo error details:", error?.response?.body || error);
      throw new Error(`Brevo email failed: ${error?.message || error}`);
    }
  }
}