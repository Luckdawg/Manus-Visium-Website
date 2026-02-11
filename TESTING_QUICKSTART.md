# Partner Portal Testing - Quick Start Guide

## 5-Minute Setup

### Step 1: Seed Test Data (1 minute)

```bash
cd /home/ubuntu/visium-technologies
node scripts/seed-test-data.mjs
```

This populates your database with:
- ✅ 4 partner companies with different tiers
- ✅ 4 partner users with various roles
- ✅ 4 sample deals at different pipeline stages
- ✅ 4 training courses with enrollments
- ✅ 2 approval workflows
- ✅ 3 conflict policies

**Output**: You'll see confirmation messages for each item created.

---

### Step 2: Access the Portal (Immediate)

Open your browser to:

| Feature | URL |
|---------|-----|
| **Partner Dashboard** | `http://localhost:3000/partners/dashboard` |
| **Deal Registration** | `http://localhost:3000/partners/deals` |
| **Training Portal** | `http://localhost:3000/partners/training` |
| **Admin Console** | `http://localhost:3000/admin/console` |
| **Partner Applications** | `http://localhost:3000/admin/partner-applications` |

---

## Quick Test Scenarios (10 minutes each)

### Test 1: View Partner Dashboard

1. Go to `/partners/dashboard`
2. You should see:
   - Partner company information
   - Deal pipeline summary
   - Training progress
   - MDF budget status

**What to verify**:
- ✅ Data loads without errors
- ✅ All sections display correctly
- ✅ Numbers match seeded data

---

### Test 2: Register a New Deal

1. Go to `/partners/deals`
2. Click "Register New Deal"
3. Fill in:
   - Deal Name: "Test Deal 2026"
   - Account: "Acme Corp"
   - Value: $100,000
   - Close Date: 2026-06-30
4. Click Submit

**What to verify**:
- ✅ Form validates input
- ✅ Deal appears in list after submission
- ✅ Deal shows "Submitted" status
- ✅ Admin can see it in approval queue

---

### Test 3: Review Partner Applications (Admin)

1. Go to `/admin/partner-applications`
2. You should see applications from seeded data
3. Click on an application
4. Try the Approve button:
   - Select tier (Silver, Gold, Platinum)
   - Set commission rate
   - Set MDF budget
   - Click Approve

**What to verify**:
- ✅ Applications list loads
- ✅ Approval form has all fields
- ✅ Application status changes after approval
- ✅ Partner is created with correct tier

---

### Test 4: Enroll in Training Course

1. Go to `/partners/training`
2. Browse available courses
3. Click "Enroll" on "TruContext Platform Fundamentals"
4. Verify enrollment confirmation

**What to verify**:
- ✅ Course list displays
- ✅ Enrollment button works
- ✅ Progress tracking appears
- ✅ Course shows in "My Courses"

---

### Test 5: Admin Console Configuration

1. Go to `/admin/console`
2. Review the dashboard metrics
3. Click on "Workflows" tab
4. View the seeded workflows
5. Click on "Policies" tab
6. View conflict policies

**What to verify**:
- ✅ Metrics display correctly
- ✅ Workflows list shows seeded data
- ✅ Policies are visible
- ✅ Audit log shows recent changes

---

## API Testing with cURL

### Get All Deals

```bash
curl http://localhost:3000/api/trpc/dealManagement.getDealPipeline
```

**Expected response**: JSON array of deals with stages

---

### Create a Test Deal

```bash
curl -X POST http://localhost:3000/api/trpc/dealManagement.createDeal \
  -H "Content-Type: application/json" \
  -d '{
    "dealName": "API Test Deal",
    "accountName": "Test Account",
    "dealValue": "150000",
    "dealCurrency": "USD",
    "expectedCloseDate": "2026-04-30"
  }'
```

**Expected response**: Success message with new deal ID

---

### Get Training Courses

```bash
curl http://localhost:3000/api/trpc/training.getCourses
```

**Expected response**: JSON array of courses

---

### Get Admin Metrics

```bash
curl http://localhost:3000/api/trpc/adminWorkflows.getDashboardMetrics
```

**Expected response**: JSON with workflow, policy, and rule counts

---

## Postman Collection

Import the provided Postman collection for easy API testing:

1. Open Postman
2. Click "Import"
3. Select `/docs/Partner-Portal-API.postman_collection.json`
4. Set `baseUrl` variable to `http://localhost:3000`
5. Start testing!

---

## Database Inspection

### View Seeded Partners

```bash
mysql> SELECT id, companyName, tier, status FROM partner_companies;
```

Expected output:
```
+-----+----------------------------+----------+--------+
| id  | companyName                | tier     | status |
+-----+----------------------------+----------+--------+
| 101 | TechVision Solutions       | Gold     | Active |
| 102 | SecureNet Partners         | Silver   | Active |
| 103 | CloudFirst Integrators     | Standard | Prospect |
| 104 | Enterprise Defense Corp    | Platinum | Active |
+-----+----------------------------+----------+--------+
```

### View Seeded Deals

```bash
mysql> SELECT id, dealName, dealValue, dealStage FROM deals;
```

### View Training Courses

```bash
mysql> SELECT id, courseName, category, status FROM training_courses;
```

---

## Troubleshooting

### "Database connection failed"

**Solution**: Verify DATABASE_URL is set:
```bash
echo $DATABASE_URL
```

Should show: `mysql://user:password@host:port/database`

---

### "No data showing in dashboard"

**Solution**: Re-run the seed script:
```bash
node scripts/seed-test-data.mjs
```

---

### "API returns 401 Unauthorized"

**Solution**: Some endpoints require authentication. Use the browser to test authenticated flows, or check if session cookie is being sent.

---

### "Courses not appearing"

**Solution**: Verify courses have status = "Published":
```bash
mysql> UPDATE training_courses SET status = 'Published' WHERE id > 0;
```

---

## What to Test Next

After basic testing, try these advanced scenarios:

1. **Multi-stage Approvals**: Create a deal > $500K and watch it go through Executive workflow
2. **Conflict Detection**: Create overlapping deals and verify conflict detection
3. **Certification Paths**: Complete multiple courses and check certification eligibility
4. **Workflow Configuration**: Create custom workflows in admin console
5. **Performance**: Load test with 100+ concurrent users

---

## Full Documentation

For comprehensive testing guide, see: `/docs/TESTING_GUIDE.md`

---

## Support

- **Questions?** Check the TESTING_GUIDE.md for detailed scenarios
- **API Issues?** Review the Postman collection
- **Database Issues?** Check the seed script output
- **UI Issues?** Check browser console for errors

Happy testing! 🚀
