import sgMail from "@sendgrid/mail";
import { ENV } from "./env";

/**
 * Initialize SendGrid with API key
 */
const initializeSendGrid = () => {
  const apiKey = ENV.sendgridApiKey;
  if (!apiKey) {
    console.warn(
      "SENDGRID_API_KEY not configured. Email sending will be disabled."
    );
    return null;
  }

  sgMail.setApiKey(apiKey);
  return sgMail;
};

const sendgridClient = initializeSendGrid();

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

/**
 * Send email via SendGrid
 */
export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  if (!sendgridClient) {
    console.warn("SendGrid not configured. Email not sent.");
    return false;
  }

  try {
    const fromEmail = options.from || ENV.sendgridFromEmail || "noreply@visium.com";

    await sendgridClient.send({
      to: options.to,
      from: fromEmail,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    console.log(`Email sent successfully to ${options.to}`);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  resetLink: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
          .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>We received a request to reset your password for your Visium Technologies Partner Portal account. If you didn't make this request, you can ignore this email.</p>
            
            <p>Click the button below to reset your password:</p>
            <a href="${resetLink}" class="button">Reset Password</a>
            
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 4px; font-size: 12px;">
              ${resetLink}
            </p>
            
            <div class="warning">
              <strong>⚠️ Security Note:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email or contact support if you have concerns about your account security.
            </div>
            
            <p>Best regards,<br>Visium Technologies Team</p>
            
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>© 2026 Visium Technologies. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Password Reset Request

Hello,

We received a request to reset your password for your Visium Technologies Partner Portal account. If you didn't make this request, you can ignore this email.

Click the link below to reset your password:
${resetLink}

This link will expire in 1 hour. If you didn't request a password reset, please ignore this email or contact support if you have concerns about your account security.

Best regards,
Visium Technologies Team

This is an automated message. Please do not reply to this email.
© 2026 Visium Technologies. All rights reserved.
  `;

  return sendEmail({
    to: email,
    subject: "Reset Your Visium Partner Portal Password",
    html,
    text,
  });
}

/**
 * Send welcome email to new partner
 */
export async function sendWelcomeEmail(
  email: string,
  companyName: string,
  loginUrl: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
          .feature-list { margin: 20px 0; }
          .feature-item { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Visium Partner Portal!</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>Welcome to the Visium Technologies Partner Portal! We're excited to have <strong>${companyName}</strong> as part of our partner ecosystem.</p>
            
            <p>Your partner account is now active and ready to use. Log in to access:</p>
            <div class="feature-list">
              <div class="feature-item">✓ Deal registration and management</div>
              <div class="feature-item">✓ MDF budget tracking and claims</div>
              <div class="feature-item">✓ Performance analytics and reporting</div>
              <div class="feature-item">✓ Document management and uploads</div>
              <div class="feature-item">✓ Partner resources and training materials</div>
            </div>
            
            <a href="${loginUrl}" class="button">Log In to Partner Portal</a>
            
            <p>If you have any questions or need assistance, please don't hesitate to contact our partner support team.</p>
            
            <p>Best regards,<br>Visium Technologies Team</p>
            
            <div class="footer">
              <p>© 2026 Visium Technologies. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: "Welcome to Visium Partner Portal",
    html,
  });
}

/**
 * Send deal approval notification
 */
export async function sendDealApprovalEmail(
  email: string,
  dealName: string,
  dealAmount: number,
  approved: boolean
): Promise<boolean> {
  const status = approved ? "Approved" : "Requires Review";
  const statusColor = approved ? "#10b981" : "#f59e0b";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .status-badge { display: inline-block; padding: 8px 16px; background: ${statusColor}; color: white; border-radius: 4px; font-weight: bold; margin: 10px 0; }
          .deal-info { background: white; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid ${statusColor}; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Deal Status Update</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>Your deal has been reviewed and updated:</p>
            
            <div class="deal-info">
              <div><strong>Deal Name:</strong> ${dealName}</div>
              <div><strong>Deal Amount:</strong> $${dealAmount.toLocaleString()}</div>
              <div><strong>Status:</strong> <span class="status-badge">${status}</span></div>
            </div>
            
            <p>Log in to your partner portal to view full details and next steps.</p>
            
            <a href="https://visium-partner.com/partners/dashboard" class="button">View Deal Details</a>
            
            <p>If you have questions about this decision, please contact our partner team.</p>
            
            <p>Best regards,<br>Visium Technologies Team</p>
            
            <div class="footer">
              <p>© 2026 Visium Technologies. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Deal Update: ${dealName} - ${status}`,
    html,
  });
}
