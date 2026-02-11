# Partner Portal Testing Guide

This guide provides comprehensive instructions for testing the Visium Technologies Partner Portal without needing test user accounts.

## Quick Start

### 1. Seed Test Data

Run the test data seeding script to populate your database with sample partners, deals, users, and configurations:

```bash
node scripts/seed-test-data.mjs
```

This creates:
- **4 Partner Companies** (TechVision Solutions, SecureNet Partners, CloudFirst Integrators, Enterprise Defense Corp)
- **4 Partner Users** with different roles
- **4 Sample Deals** at various pipeline stages
- **4 Training Courses** with enrollments
- **2 Approval Workflows** (Standard and Executive)
- **3 Conflict Policies** (Channel, Territory, Customer)

### 2. Access the Portal

The partner portal is available at:
- **Partner Dashboard**: `https://your-domain.com/partners/dashboard`
- **Deal Registration**: `https://your-domain.com/partners/deals`
- **Training**: `https://your-domain.com/partners/training`
- **Admin Console**: `https://your-domain.com/admin/console`

## Testing Scenarios

### Scenario 1: Partner Application & Onboarding

**Objective**: Test the complete partner application workflow

**Steps**:
1. Navigate to `/partners/apply`
2. Fill out the partner application form:
   - Company Name: "Test Partner Inc"
   - Contact Email: "test@partner.com"
   - Partner Type: "Reseller"
   - Region: "North America"
   - Specializations: Select 2-3 options
3. Submit the application
4. Verify success confirmation page

**Expected Results**:
- Application submitted successfully
- Confirmation email sent (check SendGrid logs)
- Application appears in `/admin/partner-applications`
- Admin can approve/reject with tier assignment

**API Endpoint**:
```bash
curl -X POST http://localhost:3000/api/trpc/partnerOnboarding.submitApplication \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Partner Inc",
    "contactEmail": "test@partner.com",
    "partnerType": "Reseller",
    "region": "North America",
    "specializations": ["Cybersecurity", "Cloud"]
  }'
```

---

### Scenario 2: Deal Registration & Approval Workflow

**Objective**: Test multi-stage deal approval process

**Steps**:
1. Navigate to `/partners/deals`
2. Click "Register New Deal"
3. Fill out deal information:
   - Deal Name: "Enterprise Security Implementation"
   - Account Name: "Fortune 500 Corp"
   - Deal Value: $250,000
   - Expected Close: 2026-03-31
4. Submit deal
5. Navigate to `/admin/partner-applications` to approve
6. Observe deal progression through stages

**Expected Results**:
- Deal created in "Submitted" stage
- Admin can review and approve
- Deal moves to "Qualified" → "Approved" → "Won/Lost"
- Deal appears in partner dashboard
- Commission calculated based on tier

**API Endpoints**:
```bash
# Register deal
curl -X POST http://localhost:3000/api/trpc/dealManagement.createDeal \
  -H "Content-Type: application/json" \
  -H "Cookie: session=YOUR_SESSION_COOKIE" \
  -d '{
    "dealName": "Enterprise Security Implementation",
    "accountName": "Fortune 500 Corp",
    "dealValue": "250000",
    "dealCurrency": "USD",
    "expectedCloseDate": "2026-03-31"
  }'

# Get deal pipeline
curl http://localhost:3000/api/trpc/dealManagement.getDealPipeline \
  -H "Cookie: session=YOUR_SESSION_COOKIE"

# Approve deal (admin)
curl -X POST http://localhost:3000/api/trpc/dealManagement.approveDeal \
  -H "Content-Type: application/json" \
  -H "Cookie: session=YOUR_SESSION_COOKIE" \
  -d '{"dealId": 1, "approverRole": "Manager"}'
```

---

### Scenario 3: Training & Certification

**Objective**: Test LMS course enrollment and progress tracking

**Steps**:
1. Navigate to `/partners/training`
2. Browse available courses
3. Enroll in "TruContext Platform Fundamentals"
4. View course progress
5. Complete course (in test data, some are pre-completed)
6. Check certification eligibility

**Expected Results**:
- Course enrollment successful
- Progress tracked (0-100%)
- Completion status updates
- Certification path visible
- Certificate generation available

**API Endpoints**:
```bash
# Get available courses
curl http://localhost:3000/api/trpc/training.getCourses

# Enroll in course
curl -X POST http://localhost:3000/api/trpc/training.enrollCourse \
  -H "Content-Type: application/json" \
  -H "Cookie: session=YOUR_SESSION_COOKIE" \
  -d '{"courseId": 1}'

# Update course progress
curl -X POST http://localhost:3000/api/trpc/training.updateProgress \
  -H "Content-Type: application/json" \
  -H "Cookie: session=YOUR_SESSION_COOKIE" \
  -d '{"enrollmentId": 1, "progressPercentage": 75}'

# Get user certifications
curl http://localhost:3000/api/trpc/training.getUserCertifications \
  -H "Cookie: session=YOUR_SESSION_COOKIE"
```

---

### Scenario 4: Conflict Detection & Resolution

**Objective**: Test conflict detection and resolution workflows

**Steps**:
1. Create two deals with overlapping customers/territories
2. System should detect conflict
3. Navigate to conflict management in admin console
4. Review conflict details
5. Apply resolution strategy
6. Verify conflict resolution

**Expected Results**:
- Conflicts automatically detected
- Severity level assigned
- Resolution options presented
- Audit trail recorded
- Partners notified of resolution

**API Endpoints**:
```bash
# Get conflicts
curl http://localhost:3000/api/trpc/dealManagement.getConflicts

# Resolve conflict
curl -X POST http://localhost:3000/api/trpc/dealManagement.resolveConflict \
  -H "Content-Type: application/json" \
  -H "Cookie: session=YOUR_SESSION_COOKIE" \
  -d '{
    "conflictId": 1,
    "resolutionStrategy": "Partner-Tier-Based",
    "notes": "Resolved based on partner tier"
  }'
```

---

### Scenario 5: Admin Configuration

**Objective**: Test admin console workflow and policy management

**Steps**:
1. Navigate to `/admin/console`
2. Review dashboard metrics
3. Create new approval workflow
4. Configure workflow stages
5. Create conflict policy
6. Create scoring rule
7. View audit log

**Expected Results**:
- Dashboard displays metrics
- Workflows created and activated
- Policies configured
- Scoring rules applied
- All changes logged in audit trail

**API Endpoints**:
```bash
# Get dashboard metrics
curl http://localhost:3000/api/trpc/adminWorkflows.getDashboardMetrics

# Create workflow
curl -X POST http://localhost:3000/api/trpc/adminWorkflows.createWorkflow \
  -H "Content-Type: application/json" \
  -H "Cookie: session=YOUR_SESSION_COOKIE" \
  -d '{
    "workflowName": "Custom Approval Process",
    "workflowCode": "WF-CUSTOM",
    "template": "Custom",
    "minDealValue": 100000
  }'

# Get audit log
curl http://localhost:3000/api/trpc/adminWorkflows.getAuditLog?limit=20
```

---

## Browser Testing Checklist

### Partner Portal Pages
- [ ] `/partners/apply` - Application form loads and submits
- [ ] `/partners/dashboard` - Dashboard displays partner info
- [ ] `/partners/deals` - Deal list and registration works
- [ ] `/partners/deals-management` - Pipeline visualization displays
- [ ] `/partners/training` - Course catalog loads
- [ ] `/partners/resources` - Resource library accessible

### Admin Pages
- [ ] `/admin/console` - Dashboard loads with metrics
- [ ] `/admin/partner-applications` - Application review works
- [ ] Workflow management interface functional
- [ ] Conflict policy management accessible
- [ ] Audit log displays correctly

### Mobile Testing
- [ ] All pages responsive on mobile (375px width)
- [ ] Forms usable on touch devices
- [ ] Navigation works on mobile
- [ ] Charts/tables readable on small screens

### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast meets WCAG AA
- [ ] Form labels properly associated

---

## Performance Testing

### Load Testing with Apache Bench

```bash
# Test partner dashboard
ab -n 100 -c 10 http://localhost:3000/partners/dashboard

# Test deal registration API
ab -n 100 -c 10 -p deal.json http://localhost:3000/api/trpc/dealManagement.createDeal
```

### Database Query Performance

Monitor slow queries in MySQL:
```sql
-- Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;

-- Check slow queries
SELECT * FROM mysql.slow_log;
```

---

## Debugging & Troubleshooting

### Enable Debug Logging

Set environment variable:
```bash
DEBUG=* npm run dev
```

### Check Database State

```bash
# View partner companies
SELECT * FROM partner_companies;

# View deals
SELECT * FROM deals;

# View approvals
SELECT * FROM deal_approvals;

# View conflicts
SELECT * FROM deal_conflicts;
```

### API Response Inspection

Use browser DevTools Network tab to inspect:
- Request/response headers
- Payload data
- Error messages
- Performance metrics

### Common Issues

**Issue**: Deals not appearing in pipeline
- **Solution**: Check partner company ID matches deal's partnerCompanyId

**Issue**: Workflows not activating
- **Solution**: Verify workflow status is "Active" in database

**Issue**: Conflicts not detected
- **Solution**: Check conflict policy is enabled (isActive = true)

**Issue**: Training courses not showing
- **Solution**: Verify course status is "Published"

---

## Test Data Reference

### Partner Companies (from seed script)

| ID | Company Name | Type | Region | Tier | Status |
|---|---|---|---|---|---|
| 101 | TechVision Solutions | Reseller | North America | Gold | Active |
| 102 | SecureNet Partners | MSP | Europe | Silver | Active |
| 103 | CloudFirst Integrators | Distributor | APAC | Standard | Prospect |
| 104 | Enterprise Defense Corp | ISV | North America | Platinum | Active |

### Test Deals

| ID | Deal Name | Value | Stage | Status |
|---|---|---|---|---|
| 301 | Acme Corp Security Upgrade | $150,000 | Qualified | Pending Approval |
| 302 | Global Tech Infrastructure Deal | $250,000 | Approved | Won |
| 303 | European Bank Compliance | €180,000 | Submitted | Under Review |
| 304 | Asia Pacific Expansion | $95,000 | Qualified | Pending Approval |

### Training Courses

| ID | Course | Code | Category | Duration |
|---|---|---|---|---|
| 401 | Platform Fundamentals | TC-101 | Sales | 120 min |
| 402 | Advanced Threat Detection | TC-201 | Technical | 240 min |
| 403 | Sales Enablement Bootcamp | TC-301 | Sales | 180 min |
| 404 | Executive Briefing | TC-401 | Executive | 60 min |

---

## Continuous Testing

### Automated Test Suite

Run vitest for unit and integration tests:
```bash
pnpm test
```

### Pre-deployment Checklist

- [ ] All unit tests passing
- [ ] Manual testing scenarios completed
- [ ] Browser compatibility verified
- [ ] Mobile responsiveness confirmed
- [ ] Accessibility audit passed
- [ ] Performance benchmarks met
- [ ] Audit logs reviewed
- [ ] Database backups created

---

## Support & Documentation

- **API Documentation**: See `/docs/API.md`
- **Database Schema**: See `/drizzle/schema.ts`
- **Component Library**: See `/client/src/components/`
- **Configuration**: See `.env.example`

For issues or questions, refer to the project README or contact the development team.
