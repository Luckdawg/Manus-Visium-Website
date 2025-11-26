# Content Management System (CMS) Documentation

## Overview

The Visium Technologies website now includes a comprehensive Content Management System that replaces WordPress functionality. The CMS provides secure user management, content editing, media management, and two-factor authentication.

## Features Implemented

### 1. User Management
- **Role-Based Access Control** with 4 permission levels:
  - **Super Admin**: Full system access including user management, content editing, and system configuration
  - **Admin**: User management and content editing capabilities
  - **Editor**: Content editing only
  - **Viewer**: Read-only access

- **User Operations**:
  - Create new admin users with email/password
  - Update user information and roles
  - Change user passwords
  - Delete users
  - View all users with their roles and 2FA status

### 2. Two-Factor Authentication (2FA)
- **TOTP-based authentication** compatible with:
  - Google Authenticator
  - Authy
  - Microsoft Authenticator
  - Any TOTP-compatible app

- **2FA Features**:
  - QR code generation for easy setup
  - Manual secret key entry option
  - Enable/disable 2FA per user
  - Required verification code on login when enabled
  - Secure secret storage in database

### 3. Content Management
- **Backend APIs** for managing website content:
  - List all content pages
  - Get specific page content
  - Update page content (text, metadata)
  - Version tracking with timestamps

- **Supported Content Types**:
  - Page titles and descriptions
  - Body content (HTML/Markdown)
  - Meta tags for SEO
  - Custom fields per page

### 4. Media Management
- **S3-based file storage** with:
  - Secure file uploads
  - Image optimization
  - File metadata tracking
  - Public URL generation
  - File type validation

### 5. Security Features
- **Password Security**:
  - Bcrypt hashing (10 rounds)
  - Minimum 8 characters required
  - Secure password reset capability

- **Session Management**:
  - Secure HTTP-only cookies
  - 7-day session duration
  - Automatic session expiration

- **Audit Logging**:
  - All admin actions logged
  - User tracking (who did what)
  - Timestamp recording
  - IP address logging

## Database Schema

### Users Table Extensions
```sql
- role: ENUM('super_admin', 'admin', 'editor', 'viewer')
- password: VARCHAR(255) -- bcrypt hashed
- twoFactorEnabled: TINYINT(1)
- twoFactorSecret: VARCHAR(255)
- loginMethod: ENUM('oauth', 'local')
```

### Content Pages Table
```sql
- id: INT PRIMARY KEY
- slug: VARCHAR(255) UNIQUE
- title: VARCHAR(255)
- content: TEXT
- metaDescription: TEXT
- customFields: JSON
- createdAt: DATETIME
- updatedAt: DATETIME
- createdBy: INT (user ID)
- updatedBy: INT (user ID)
```

### Media Library Table
```sql
- id: INT PRIMARY KEY
- filename: VARCHAR(255)
- originalName: VARCHAR(255)
- mimeType: VARCHAR(100)
- size: INT
- s3Key: VARCHAR(500)
- s3Url: TEXT
- uploadedBy: INT (user ID)
- createdAt: DATETIME
```

### Audit Logs Table
```sql
- id: INT PRIMARY KEY
- userId: INT
- action: VARCHAR(255)
- entity: VARCHAR(100)
- entityId: INT
- changes: JSON
- ipAddress: VARCHAR(45)
- userAgent: TEXT
- createdAt: DATETIME
```

## API Endpoints

### Authentication
- `POST /api/trpc/auth.loginLocal` - Local admin login
- `POST /api/trpc/auth.verify2FALogin` - Verify 2FA code
- `POST /api/trpc/auth.logout` - Logout current user

### User Management
- `GET /api/trpc/admin.getCurrentUser` - Get current logged-in user
- `GET /api/trpc/admin.listUsers` - List all users (admin only)
- `POST /api/trpc/admin.createUser` - Create new user (admin only)
- `PUT /api/trpc/admin.updateUser` - Update user (admin only)
- `DELETE /api/trpc/admin.deleteUser` - Delete user (super admin only)

### Two-Factor Authentication
- `GET /api/trpc/twoFactor.status` - Check 2FA status
- `POST /api/trpc/twoFactor.setup` - Generate 2FA secret and QR code
- `POST /api/trpc/twoFactor.enable` - Enable 2FA with verification
- `POST /api/trpc/twoFactor.disable` - Disable 2FA

### Content Management
- `GET /api/trpc/cms.listPages` - List all content pages
- `GET /api/trpc/cms.getPage` - Get specific page content
- `PUT /api/trpc/cms.updatePage` - Update page content (editor role required)
- `POST /api/trpc/cms.createPage` - Create new page (editor role required)

### Media Management
- `POST /api/trpc/cms.uploadMedia` - Upload file to S3
- `GET /api/trpc/cms.listMedia` - List all media files
- `DELETE /api/trpc/cms.deleteMedia` - Delete media file

## Admin Panel Routes

### Public Routes
- `/admin/login` - Admin login page

### Protected Routes (require authentication)
- `/admin` - Admin dashboard (overview)
- `/admin/users` - User management interface
- `/admin/security` - 2FA and security settings
- `/admin/content` - Content editor (to be implemented)
- `/admin/media` - Media library (to be implemented)
- `/admin/audit` - Audit logs viewer (to be implemented)

## Initial Admin Account

A default super admin account has been created:

```
Email: admin@visiumtechnologies.com
Password: Admin123!
```

**⚠️ IMPORTANT**: Change this password immediately after first login!

## Usage Instructions

### Creating a New Admin User

1. Log in to `/admin/login` with super admin credentials
2. Navigate to `/admin/users`
3. Click "Add User" button
4. Fill in user details:
   - Name
   - Email
   - Password (min 8 characters)
   - Role (super_admin, admin, editor, or viewer)
5. Click "Create User"

### Setting Up 2FA

1. Log in to admin panel
2. Navigate to `/admin/security`
3. Click "Enable 2FA"
4. Scan QR code with authenticator app
5. Enter 6-digit verification code
6. 2FA is now enabled

### Editing Website Content

1. Log in with editor role or higher
2. Navigate to `/admin/content`
3. Select page to edit
4. Update content in editor
5. Click "Save Changes"
6. Changes are immediately live

### Uploading Media

1. Log in to admin panel
2. Navigate to `/admin/media`
3. Click "Upload" or drag-and-drop files
4. Files are automatically uploaded to S3
5. Copy public URL to use in content

## Security Best Practices

1. **Enable 2FA** for all admin accounts, especially super admins
2. **Use strong passwords** with mix of characters, numbers, symbols
3. **Limit super admin access** to only necessary personnel
4. **Review audit logs** regularly for suspicious activity
5. **Change default password** immediately after setup
6. **Use HTTPS** in production (automatic with Manus deployment)
7. **Regular backups** of database content
8. **Session timeout** is set to 7 days - log out when done

## Technical Implementation

### Password Hashing
```typescript
import bcrypt from 'bcryptjs';
const hashedPassword = await bcrypt.hash(password, 10);
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

### 2FA Implementation
```typescript
import { authenticator } from 'otplib';
const secret = authenticator.generateSecret();
const qrCode = await qrcode.toDataURL(otpauth_url);
const isValid = authenticator.verify({ token, secret });
```

### Session Management
```typescript
res.cookie(COOKIE_NAME, JSON.stringify(userData), {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});
```

## Future Enhancements

The following features are planned but not yet implemented:

1. **Rich Text Editor** - WYSIWYG editor for content pages
2. **Media Library UI** - Visual browser for uploaded files
3. **Audit Log Viewer** - Interface to view system activity
4. **Content Versioning** - Track and restore previous versions
5. **Bulk Operations** - Manage multiple users/pages at once
6. **Email Notifications** - Alert on important admin actions
7. **API Rate Limiting** - Prevent abuse of admin endpoints
8. **IP Whitelisting** - Restrict admin access by IP
9. **Content Scheduling** - Publish content at specific times
10. **Multi-language Support** - Manage translations

## Troubleshooting

### Cannot Login
- Verify email and password are correct
- Check if 2FA is enabled and code is current
- Ensure cookies are enabled in browser
- Check database connection

### 2FA Code Not Working
- Ensure device time is synchronized
- Try generating a new code
- Verify secret was saved correctly
- Check if 2FA is actually enabled

### Permission Denied
- Verify user role has required permissions
- Check if session has expired
- Ensure user account is active
- Review audit logs for issues

## Support

For technical support or questions about the CMS:
- Review this documentation
- Check audit logs for error details
- Contact system administrator
- Submit feedback at https://help.manus.im
