# Partner Portal Email Troubleshooting Guide

## Overview

The Visium Partner Portal uses SendGrid to send transactional emails including welcome emails, password reset notifications, and deal status updates. This guide helps troubleshoot email delivery issues.

## Common Issues & Solutions

### Issue 1: Welcome Email Not Received After Registration

**Symptoms:**
- Partner completes registration form
- No confirmation email arrives in inbox
- No error message shown to user

**Root Causes & Solutions:**

#### 1.1 SendGrid API Key Not Configured

**Check:**
```bash
# Verify environment variables are set
echo $SENDGRID_API_KEY
echo $SENDGRID_FROM_EMAIL
```

**Fix:**
1. Set `SENDGRID_API_KEY` in your `.env` file with your SendGrid API key
2. Set `SENDGRID_FROM_EMAIL` to a verified sender email (e.g., `noreply@visium.com`)
3. Restart the dev server: `pnpm dev`

#### 1.2 SendGrid API Key Invalid or Expired

**Check:**
- Log in to [SendGrid Dashboard](https://app.sendgrid.com)
- Go to Settings → API Keys
- Verify your API key is active and not revoked

**Fix:**
1. Create a new API key if the current one is invalid
2. Update `SENDGRID_API_KEY` in `.env`
3. Restart the server

#### 1.3 From Email Not Verified

**Check:**
- Log in to SendGrid Dashboard
- Go to Settings → Sender Authentication
- Verify that `SENDGRID_FROM_EMAIL` is listed as a verified sender

**Fix:**
1. Add new sender email in SendGrid dashboard
2. Verify the email (SendGrid will send a confirmation)
3. Update `SENDGRID_FROM_EMAIL` in `.env`
4. Restart the server

### Issue 2: Email Sent But Goes to Spam

**Symptoms:**
- Email is received but appears in spam/junk folder
- Email headers show SendGrid as sender

**Solutions:**

1. **Add SPF Record** (if using custom domain)
   - Add SendGrid SPF record to your DNS
   - Record: `v=spf1 sendgrid.net ~all`

2. **Add DKIM Authentication**
   - Enable DKIM in SendGrid settings
   - Add DKIM records to your DNS

3. **Add DMARC Policy**
   - Create DMARC record in DNS
   - Example: `v=DMARC1; p=none; rua=mailto:admin@yourdomain.com`

4. **Improve Email Content**
   - Avoid spam trigger words
   - Include unsubscribe link (optional for transactional emails)
   - Use professional templates

### Issue 3: Email Sending Fails with Error

**Symptoms:**
- Error message in server logs
- User sees error notification
- Email is not sent

**Check Server Logs:**
```bash
# View recent server logs for email errors
tail -f /home/ubuntu/visium-technologies/logs/server.log | grep -i email
```

**Common Errors:**

| Error | Cause | Solution |
|-------|-------|----------|
| `Invalid API key` | API key is wrong or expired | Update SENDGRID_API_KEY |
| `Unauthorized` | API key doesn't have email sending permission | Create new API key with mail.send permission |
| `Invalid email address` | Email format is invalid | Validate email format before sending |
| `Rate limit exceeded` | Too many emails sent too quickly | Implement rate limiting |
| `Sender not verified` | From email is not verified in SendGrid | Verify sender in SendGrid dashboard |

## Testing Email Configuration

### Method 1: Run Test Script

```bash
# Set test email address
export TEST_EMAIL="your-test-email@example.com"

# Run test script
node scripts/test-email.mjs
```

Expected output:
```
✅ Email sent successfully!

📬 Email Details:
  To: your-test-email@example.com
  From: noreply@visium.com
  Subject: ✅ Visium Partner Portal - Email Configuration Test
  Status: Accepted
```

### Method 2: Manual Test via API

```bash
# Test via tRPC API
curl -X POST http://localhost:3000/api/trpc/partner.register \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Company",
    "contactName": "Test User",
    "partnerType": "Reseller",
    "email": "test@example.com",
    "password": "TestPassword123!",
    "phone": "555-1234"
  }'
```

Check your email inbox for welcome email.

### Method 3: Check SendGrid Activity

1. Log in to [SendGrid Dashboard](https://app.sendgrid.com)
2. Go to Mail → Activity
3. Search for your test email address
4. Check delivery status and bounce reasons

## Email Templates

### Welcome Email (New Partner)
- **Trigger:** After successful registration
- **Recipient:** New partner email
- **Purpose:** Confirm account creation and provide login link
- **File:** `server/_core/sendgrid.ts` → `sendWelcomeEmail()`

### Password Reset Email
- **Trigger:** When partner requests password reset
- **Recipient:** Partner email
- **Purpose:** Provide secure password reset link
- **File:** `server/_core/sendgrid.ts` → `sendPasswordResetEmail()`

### Deal Status Update Email
- **Trigger:** When deal is approved/rejected
- **Recipient:** Partner email
- **Purpose:** Notify partner of deal status change
- **File:** `server/_core/sendgrid.ts` → `sendDealApprovalEmail()`

## Environment Variables Required

```env
# SendGrid Configuration
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@visium.com
```

## Monitoring & Alerts

### Check Email Delivery Rate

```bash
# Query database for email events (if logging is enabled)
SELECT COUNT(*) as total_emails,
       SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent,
       SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
FROM email_events
WHERE created_at > NOW() - INTERVAL 24 HOUR;
```

### Enable Email Logging

Add to `.env`:
```env
LOG_EMAILS=true
EMAIL_LOG_FILE=/home/ubuntu/visium-technologies/logs/emails.log
```

## Best Practices

1. **Always verify sender email** in SendGrid before using
2. **Use descriptive subject lines** for better deliverability
3. **Include unsubscribe link** for marketing emails (not required for transactional)
4. **Test with real email addresses** before production
5. **Monitor SendGrid dashboard** for bounce and complaint rates
6. **Implement retry logic** for failed emails
7. **Log all email sends** for debugging and auditing
8. **Use templates** for consistent formatting

## Support

If emails are still not working:

1. Check SendGrid API key and sender verification
2. Review server logs for error messages
3. Test with `node scripts/test-email.mjs`
4. Check SendGrid Activity dashboard for delivery status
5. Contact SendGrid support if API issues persist

## Related Files

- Email sending logic: `server/_core/sendgrid.ts`
- Partner registration: `server/routers/partner.ts`
- Test script: `scripts/test-email.mjs`
- Environment config: `server/_core/env.ts`
