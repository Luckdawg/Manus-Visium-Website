#!/usr/bin/env node

/**
 * Test script to verify SendGrid email configuration and sending
 * Run with: node scripts/test-email.mjs
 */

import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';

dotenv.config();

const apiKey = process.env.SENDGRID_API_KEY;
const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@visium.com';
const testEmail = process.env.TEST_EMAIL || 'test@example.com';

console.log('🔍 SendGrid Email Configuration Test\n');
console.log(`API Key configured: ${apiKey ? '✅ Yes' : '❌ No'}`);
console.log(`From Email: ${fromEmail}`);
console.log(`Test Email: ${testEmail}\n`);

if (!apiKey) {
  console.error('❌ SENDGRID_API_KEY not configured. Please set it in your .env file');
  process.exit(1);
}

sgMail.setApiKey(apiKey);

const testEmail_html = `
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
        .success { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Email Configuration Test</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>This is a test email to verify that SendGrid is properly configured and working.</p>
          
          <div class="success">
            <strong>✓ Success:</strong> If you're reading this email, SendGrid is working correctly!
          </div>
          
          <p><strong>Test Details:</strong></p>
          <ul>
            <li>API Key: Configured ✓</li>
            <li>From Email: ${fromEmail}</li>
            <li>To Email: ${testEmail}</li>
            <li>Timestamp: ${new Date().toISOString()}</li>
          </ul>
          
          <p>Your partner portal email notifications are now ready to use.</p>
          
          <p>Best regards,<br>Visium Technologies Team</p>
          
          <div class="footer">
            <p>© 2026 Visium Technologies. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
  </html>
`;

async function sendTestEmail() {
  try {
    console.log('📧 Sending test email...\n');
    
    const msg = {
      to: testEmail,
      from: fromEmail,
      subject: '✅ Visium Partner Portal - Email Configuration Test',
      html: testEmail_html,
      text: 'This is a test email from Visium Partner Portal. If you received this, email configuration is working correctly.',
    };

    const response = await sgMail.send(msg);
    
    console.log('✅ Email sent successfully!\n');
    console.log('📬 Email Details:');
    console.log(`  To: ${testEmail}`);
    console.log(`  From: ${fromEmail}`);
    console.log(`  Subject: ${msg.subject}`);
    console.log(`  Status: ${response[0].statusCode === 202 ? 'Accepted' : 'Unknown'}\n`);
    
    console.log('💡 Next Steps:');
    console.log(`  1. Check the inbox at ${testEmail}`);
    console.log('  2. If email is not received, check spam/junk folder');
    console.log('  3. Verify SENDGRID_API_KEY and SENDGRID_FROM_EMAIL are correct');
    console.log('  4. Check SendGrid dashboard for any delivery failures\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to send email:\n');
    console.error(error);
    console.error('\n🔧 Troubleshooting:');
    console.error('  1. Verify SENDGRID_API_KEY is correct');
    console.error('  2. Verify SENDGRID_FROM_EMAIL is a verified sender');
    console.error('  3. Check SendGrid account status and usage limits');
    console.error('  4. Ensure network connectivity to SendGrid API\n');
    process.exit(1);
  }
}

sendTestEmail();
