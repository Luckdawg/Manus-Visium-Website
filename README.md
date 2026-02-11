# Visium Technologies - Partner Portal

Production-ready B2B partner portal with complete deal management, document handling, and admin approval workflows.

## Features

### Partner Portal
- **Dashboard** - Real-time KPI metrics (active deals, deal value, won deals, commission earned)
- **Deal Registration** - Multi-step wizard for deal submission with validation
- **Deal Management** - View, track, and manage deal status through approval workflow
- **Document Management** - Upload, categorize, and manage supporting documents per deal
- **Performance Metrics** - Monthly performance charts, deal distribution, MDF budget tracking

### Authentication & Security
- **Strong Password Requirements** - Minimum 12 characters with uppercase, lowercase, numbers, special characters
- **Real-Time Password Strength Indicator** - Visual feedback during password entry
- **Password Recovery** - Secure email-based password reset with one-time tokens
- **Remember Me** - 30-day persistent session tokens for returning partners
- **Direct Login** - Existing partners can skip setup wizard and login directly

### Admin Dashboard
- **Deal Approval Queue** - Review pending deals with partner information
- **Approval/Rejection** - Approve or reject deals with notes
- **Partner Performance Analytics** - Track deals submitted, conversion rates, commission
- **Pipeline Visualization** - Monitor deal status distribution and trends

### Email Notifications
- **SendGrid Integration** - Professional HTML email templates
- **Deal Notifications** - Approval, rejection, and status update emails
- **Password Recovery** - Secure reset links sent via email
- **Document Alerts** - Admin notifications for document uploads

## Deployment

### Prerequisites
- Node.js 22.13.0+
- MySQL/TiDB database
- SendGrid API key for email notifications

### Environment Variables
```
DATABASE_URL=mysql://user:password@host/database
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@visium.com
JWT_SECRET=your_jwt_secret
VITE_APP_TITLE=Visium Technologies
VITE_APP_LOGO=https://your-logo-url.com/logo.png
```

### Quick Start
```bash
# Install dependencies
pnpm install

# Run database migrations
pnpm db:push

# Start development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

### Deploy to Production
1. Create a new checkpoint in the Management UI
2. Click the **Publish** button (appears after checkpoint creation)
3. Configure custom domain in Settings → Domains
4. Verify all environment variables are set
5. Monitor deployment status in Dashboard

## Architecture

### Database Schema
- **partner_users** - Partner accounts with authentication
- **partner_deals** - Deal records with status tracking
- **partner_deal_documents** - File storage and categorization
- **partner_password_reset_tokens** - Secure password recovery

### API Procedures (tRPC)
- `partner.login()` - Authenticate with email/password and Remember Me option
- `partner.submitDeal()` - Register new deal
- `partner.approveDeal()` - Admin approval with notes
- `partner.rejectDeal()` - Admin rejection with reason
- `partner.uploadDocument()` - Upload supporting documents
- `partner.getDashboardMetrics()` - Fetch KPI data
- `partner.requestPasswordReset()` - Initiate password recovery
- `partner.resetPassword()` - Complete password reset with token

### Frontend Routes
- `/partners` - Partner landing page with login button
- `/partners/login` - Partner login with recovery option
- `/partners/reset-password` - Password reset page
- `/partners/onboarding` - New partner onboarding wizard
- `/partners/dashboard` - Partner dashboard with metrics
- `/partners/deals` - Deal management and registration
- `/admin/deals` - Admin approval dashboard

## Testing

Comprehensive test suite with 110+ tests covering:
- Password validation and strength checking
- Deal submission and approval workflows
- Document upload and management
- Email notification sending
- Authentication and session management

Run tests:
```bash
pnpm test
```

## Security

- ✅ Password hashing with bcrypt (10+ salt rounds)
- ✅ Secure token generation (crypto.randomBytes)
- ✅ HTTPS enforced on all API calls
- ✅ CORS restricted to portal domain
- ✅ Rate limiting on password reset (3 per hour)
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection (input sanitization)
- ✅ CSRF tokens for state-changing operations
- ✅ Secure cookie settings (HttpOnly, Secure, SameSite)

## Performance

- Dashboard metrics cached for 5 minutes
- Deal lists paginated (20 items per page)
- Charts lazy-loaded on dashboard
- File uploads compressed before storage
- Static assets served via CDN

## Support

For issues or questions:
1. Check the [Partner Portal Skill](/skills/b2b-partner-portal) for implementation details
2. Review test files for usage examples
3. Check server logs for error details

## License

Proprietary - Visium Technologies
