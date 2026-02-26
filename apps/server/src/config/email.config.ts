import nodemailer from "nodemailer";

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Create transporter based on environment
const createTransporter = () => {
  // For production, use real SMTP credentials from environment variables
  if (process.env.NODE_ENV === "production") {
    const emailConfig: EmailConfig = {
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || "",
      },
    };

    return nodemailer.createTransport(emailConfig);
  }

  // For development, use Ethereal Email (fake SMTP for testing)
  // You can view sent emails at https://ethereal.email
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: process.env.ETHEREAL_USER || "ethereal.user@ethereal.email",
      pass: process.env.ETHEREAL_PASS || "ethereal_password",
    },
  });
};

export const emailTransporter = createTransporter();

// Email sender configuration
export const EMAIL_FROM = process.env.EMAIL_FROM || "Civic Pulse <noreply@civicpulse.in>";

// Test email connection
export async function verifyEmailConnection() {
  try {
    await emailTransporter.verify();
    console.log("✅ Email server is ready to send messages");
    return true;
  } catch (error) {
    console.error("❌ Email server connection failed:", error);
    return false;
  }
}
