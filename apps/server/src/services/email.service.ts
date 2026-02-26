import { emailTransporter, EMAIL_FROM } from "../config/email.config.js";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Generic email sending function
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const info = await emailTransporter.sendMail({
      from: EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ""), // Strip HTML for text version
    });

    console.log(`✉️  Email sent to ${options.to}: ${info.messageId}`);
    
    // If using Ethereal for testing, log the preview URL
    if (process.env.NODE_ENV !== "production") {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log(`📧 Preview URL: ${previewUrl}`);
      }
    }

    return true;
  } catch (error) {
    console.error(`❌ Failed to send email to ${options.to}:`, error);
    return false;
  }
}

/**
 * Email template for complaint escalation
 */
export async function sendEscalationEmail(data: {
  recipientEmail: string;
  recipientName: string;
  complaintId: string;
  complaintTitle: string;
  complaintDescription: string;
  escalatedBy: string;
  escalatedFrom: string;
  escalatedTo: string;
  reason: string;
  escalationLevel: number;
}) {
  const subject = `⚠️ Complaint Escalated: ${data.complaintId}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
          .footer { background: #f9fafb; padding: 20px; border-radius: 0 0 10px 10px; text-align: center; font-size: 12px; color: #6b7280; }
          .badge { display: inline-block; padding: 5px 10px; border-radius: 5px; font-size: 12px; font-weight: bold; }
          .badge-warning { background: #fef3c7; color: #92400e; }
          .badge-info { background: #dbeafe; color: #1e40af; }
          .info-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .button { display: inline-block; padding: 12px 24px; background: #f97316; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
          .detail-row { margin: 10px 0; padding: 10px; background: #f9fafb; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">🚨 Complaint Escalation Alert</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Immediate attention required</p>
          </div>
          
          <div class="content">
            <p>Dear <strong>${data.recipientName}</strong>,</p>
            
            <div class="info-box">
              <strong>⬆️ A complaint has been escalated to you for immediate attention.</strong>
            </div>
            
            <div class="detail-row">
              <strong>Complaint ID:</strong> ${data.complaintId}<br>
              <span class="badge badge-warning">Escalation Level: ${data.escalationLevel}</span>
            </div>
            
            <div class="detail-row">
              <strong>Title:</strong> ${data.complaintTitle}
            </div>
            
            <div class="detail-row">
              <strong>Description:</strong><br>
              ${data.complaintDescription}
            </div>
            
            <div class="detail-row">
              <strong>Escalated By:</strong> ${data.escalatedBy} (${data.escalatedFrom})<br>
              <strong>Escalated To:</strong> ${data.escalatedTo}
            </div>
            
            <div class="detail-row">
              <strong>Escalation Reason:</strong><br>
              <em>"${data.reason}"</em>
            </div>
            
            <p style="margin-top: 25px;">
              <strong>Action Required:</strong> Please review this complaint and take appropriate action.
            </p>
            
            <a href="${process.env.APP_URL || 'http://localhost:3000'}/complaints" class="button">
              View Complaint Details
            </a>
          </div>
          
          <div class="footer">
            <p>This is an automated notification from Civic Pulse Grievance System</p>
            <p>© 2026 Civic Pulse. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: data.recipientEmail,
    subject,
    html,
  });
}

/**
 * Email template for complaint status update (operator resolves/updates)
 */
export async function sendStatusUpdateEmail(data: {
  recipientEmail: string;
  recipientName: string;
  complaintId: string;
  complaintTitle: string;
  oldStatus: string;
  newStatus: string;
  updatedBy: string;
  updatedByRole: string;
}) {
  const subject = `📊 Complaint Status Updated: ${data.complaintId}`;
  
  const statusColors: Record<string, string> = {
    pending: '#fbbf24',
    assigned: '#3b82f6',
    under_progress: '#8b5cf6',
    resolved: '#10b981',
    closed: '#6b7280',
    rejected: '#ef4444',
  };
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
          .footer { background: #f9fafb; padding: 20px; border-radius: 0 0 10px 10px; text-align: center; font-size: 12px; color: #6b7280; }
          .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; color: white; }
          .status-transition { text-align: center; margin: 30px 0; }
          .arrow { font-size: 24px; margin: 0 10px; color: #6b7280; }
          .detail-row { margin: 10px 0; padding: 10px; background: #f9fafb; border-radius: 5px; }
          .button { display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">📊 Status Update Notification</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Complaint status has been updated</p>
          </div>
          
          <div class="content">
            <p>Dear <strong>${data.recipientName}</strong>,</p>
            
            <p>The following complaint status has been updated:</p>
            
            <div class="detail-row">
              <strong>Complaint ID:</strong> ${data.complaintId}
            </div>
            
            <div class="detail-row">
              <strong>Title:</strong> ${data.complaintTitle}
            </div>
            
            <div class="status-transition">
              <span class="status-badge" style="background-color: ${statusColors[data.oldStatus] || '#6b7280'}">
                ${data.oldStatus.replace(/_/g, ' ').toUpperCase()}
              </span>
              <span class="arrow">→</span>
              <span class="status-badge" style="background-color: ${statusColors[data.newStatus] || '#6b7280'}">
                ${data.newStatus.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>
            
            <div class="detail-row">
              <strong>Updated By:</strong> ${data.updatedBy} (${data.updatedByRole})
            </div>
            
            <p style="margin-top: 25px;">
              ${data.newStatus === 'resolved' 
                ? '<strong>✅ Great news!</strong> This complaint has been marked as resolved. Please verify the resolution.' 
                : 'Please review this update and take necessary action if required.'}
            </p>
            
            <a href="${process.env.APP_URL || 'http://localhost:3000'}/complaints" class="button">
              View Complaint Details
            </a>
          </div>
          
          <div class="footer">
            <p>This is an automated notification from Civic Pulse Grievance System</p>
            <p>© 2026 Civic Pulse. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: data.recipientEmail,
    subject,
    html,
  });
}

/**
 * Email template for department override notification
 */
export async function sendOverrideNotificationEmail(data: {
  recipientEmail: string;
  recipientName: string;
  complaintId: string;
  complaintTitle: string;
  originalStatus: string;
  overriddenStatus: string;
  overriddenBy: string;
}) {
  const subject = `🔄 Department Override Alert: ${data.complaintId}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
          .footer { background: #f9fafb; padding: 20px; border-radius: 0 0 10px 10px; text-align: center; font-size: 12px; color: #6b7280; }
          .alert-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .detail-row { margin: 10px 0; padding: 10px; background: #f9fafb; border-radius: 5px; }
          .button { display: inline-block; padding: 12px 24px; background: #8b5cf6; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">🔄 Status Override Notice</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Department has overridden complaint status</p>
          </div>
          
          <div class="content">
            <p>Dear <strong>${data.recipientName}</strong>,</p>
            
            <div class="alert-box">
              <strong>⚠️ A department administrator has overridden the status of a complaint.</strong>
            </div>
            
            <div class="detail-row">
              <strong>Complaint ID:</strong> ${data.complaintId}
            </div>
            
            <div class="detail-row">
              <strong>Title:</strong> ${data.complaintTitle}
            </div>
            
            <div class="detail-row">
              <strong>Original Status:</strong> ${data.originalStatus}<br>
              <strong>Overridden To:</strong> ${data.overriddenStatus}
            </div>
            
            <div class="detail-row">
              <strong>Overridden By:</strong> ${data.overriddenBy} (Department)
            </div>
            
            <p style="margin-top: 25px;">
              This is a critical action notification for tracking purposes.
            </p>
            
            <a href="${process.env.APP_URL || 'http://localhost:3000'}/complaints" class="button">
              View Complaint Details
            </a>
          </div>
          
          <div class="footer">
            <p>This is an automated notification from Civic Pulse Grievance System</p>
            <p>© 2026 Civic Pulse. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: data.recipientEmail,
    subject,
    html,
  });
}

// Re-export for convenience
import nodemailer from "nodemailer";
