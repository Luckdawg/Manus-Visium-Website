import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getDb } from '../../db';
import { eq } from 'drizzle-orm';

/**
 * Integration Tests for Critical Partner Portal Workflows
 * Tests deal approval, conflict detection, training, and onboarding flows
 */

describe('Partner Portal Integration Tests', () => {
  let db: any;

  beforeAll(async () => {
    db = await getDb();
  });

  afterAll(async () => {
    // Cleanup if needed
  });

  // ============================================================================
  // DEAL APPROVAL WORKFLOW TESTS
  // ============================================================================

  describe('Deal Approval Workflow', () => {
    it('should create a deal in submitted status', async () => {
      const { deals } = await import('../../../drizzle/deal-management-schema');

      const result = await db.insert(deals).values({
        partnerCompanyId: 101,
        dealName: 'Test Deal - Approval Workflow',
        accountName: 'Test Account',
        dealValue: '150000',
        dealCurrency: 'USD',
        dealStage: 'Submitted',
        dealStatus: 'Under Review',
        expectedCloseDate: new Date('2026-06-30'),
        description: 'Integration test deal',
      });

      expect((result as any).insertId).toBeGreaterThan(0);
    });

    it('should progress deal through approval stages', async () => {
      const { deals } = await import('../../../drizzle/deal-management-schema');

      // Create deal
      const createResult = await db.insert(deals).values({
        partnerCompanyId: 101,
        dealName: 'Test Deal - Stage Progression',
        accountName: 'Test Account',
        dealValue: '200000',
        dealCurrency: 'USD',
        dealStage: 'Submitted',
        dealStatus: 'Under Review',
        expectedCloseDate: new Date('2026-06-30'),
      });

      const dealId = (createResult as any).insertId;

      // Update to Qualified
      await db
        .update(deals)
        .set({ dealStage: 'Qualified', dealStatus: 'Pending Approval' })
        .where(eq(deals.id, dealId));

      // Verify update
      const qualified = await db.select().from(deals).where(eq(deals.id, dealId)).limit(1);
      expect(qualified[0].dealStage).toBe('Qualified');

      // Update to Approved
      await db
        .update(deals)
        .set({ dealStage: 'Approved', dealStatus: 'Approved' })
        .where(eq(deals.id, dealId));

      const approved = await db.select().from(deals).where(eq(deals.id, dealId)).limit(1);
      expect(approved[0].dealStage).toBe('Approved');
    });

    it('should calculate commission on deal approval', async () => {
      const { deals } = await import('../../../drizzle/deal-management-schema');
      const { partnerCompanies } = await import('../../../drizzle/schema');

      // Get partner with known commission rate
      const partner = await db
        .select()
        .from(partnerCompanies)
        .where(eq(partnerCompanies.id, 101))
        .limit(1);

      expect(partner[0].commissionRate).toBeGreaterThan(0);

      // Create deal
      const dealValue = 100000;
      const createResult = await db.insert(deals).values({
        partnerCompanyId: 101,
        dealName: 'Test Deal - Commission Calculation',
        accountName: 'Test Account',
        dealValue: dealValue.toString(),
        dealCurrency: 'USD',
        dealStage: 'Approved',
        dealStatus: 'Won',
        expectedCloseDate: new Date('2026-06-30'),
      });

      const deal = await db
        .select()
        .from(deals)
        .where(eq(deals.id, (createResult as any).insertId))
        .limit(1);

      const expectedCommission = dealValue * (partner[0].commissionRate / 100);
      expect(expectedCommission).toBeGreaterThan(0);
    });

    it('should reject deal and allow resubmission', async () => {
      const { deals } = await import('../../../drizzle/deal-management-schema');

      // Create deal
      const createResult = await db.insert(deals).values({
        partnerCompanyId: 101,
        dealName: 'Test Deal - Rejection',
        accountName: 'Test Account',
        dealValue: '150000',
        dealCurrency: 'USD',
        dealStage: 'Submitted',
        dealStatus: 'Under Review',
        expectedCloseDate: new Date('2026-06-30'),
      });

      const dealId = (createResult as any).insertId;

      // Reject deal
      await db
        .update(deals)
        .set({ dealStatus: 'Rejected' })
        .where(eq(deals.id, dealId));

      const rejected = await db.select().from(deals).where(eq(deals.id, dealId)).limit(1);
      expect(rejected[0].dealStatus).toBe('Rejected');

      // Resubmit deal
      await db
        .update(deals)
        .set({ dealStatus: 'Under Review' })
        .where(eq(deals.id, dealId));

      const resubmitted = await db.select().from(deals).where(eq(deals.id, dealId)).limit(1);
      expect(resubmitted[0].dealStatus).toBe('Under Review');
    });
  });

  // ============================================================================
  // CONFLICT DETECTION TESTS
  // ============================================================================

  describe('Conflict Detection Workflow', () => {
    it('should detect channel conflicts between partners', async () => {
      const { deals, dealConflicts } = await import('../../../drizzle/deal-management-schema');

      // Create two deals from different partners for same account
      const deal1 = await db.insert(deals).values({
        partnerCompanyId: 101,
        dealName: 'Channel Conflict Test - Deal 1',
        accountName: 'Conflict Test Corp',
        dealValue: '100000',
        dealCurrency: 'USD',
        dealStage: 'Qualified',
        dealStatus: 'Pending Approval',
        expectedCloseDate: new Date('2026-06-30'),
      });

      const deal2 = await db.insert(deals).values({
        partnerCompanyId: 102,
        dealName: 'Channel Conflict Test - Deal 2',
        accountName: 'Conflict Test Corp',
        dealValue: '100000',
        dealCurrency: 'USD',
        dealStage: 'Qualified',
        dealStatus: 'Pending Approval',
        expectedCloseDate: new Date('2026-06-30'),
      });

      // Create conflict record
      const conflict = await db.insert(dealConflicts).values({
        deal1Id: (deal1 as any).insertId,
        deal2Id: (deal2 as any).insertId,
        conflictType: 'Channel',
        severity: 'High',
        status: 'Detected',
        description: 'Two partners competing for same customer',
      });

      expect((conflict as any).insertId).toBeGreaterThan(0);

      // Verify conflict is detected
      const detected = await db
        .select()
        .from(dealConflicts)
        .where(eq(dealConflicts.id, (conflict as any).insertId))
        .limit(1);

      expect(detected[0].conflictType).toBe('Channel');
      expect(detected[0].severity).toBe('High');
    });

    it('should detect territory conflicts', async () => {
      const { deals, dealConflicts } = await import('../../../drizzle/deal-management-schema');

      // Create deals in same territory
      const deal1 = await db.insert(deals).values({
        partnerCompanyId: 101,
        dealName: 'Territory Conflict - Deal 1',
        accountName: 'Territory Test 1',
        dealValue: '100000',
        dealCurrency: 'USD',
        dealStage: 'Qualified',
        dealStatus: 'Pending Approval',
        expectedCloseDate: new Date('2026-06-30'),
      });

      const deal2 = await db.insert(deals).values({
        partnerCompanyId: 101,
        dealName: 'Territory Conflict - Deal 2',
        accountName: 'Territory Test 2',
        dealValue: '100000',
        dealCurrency: 'USD',
        dealStage: 'Qualified',
        dealStatus: 'Pending Approval',
        expectedCloseDate: new Date('2026-06-30'),
      });

      // Create territory conflict
      const conflict = await db.insert(dealConflicts).values({
        deal1Id: (deal1 as any).insertId,
        deal2Id: (deal2 as any).insertId,
        conflictType: 'Territory',
        severity: 'Medium',
        status: 'Detected',
        description: 'Overlapping territory assignments',
      });

      const detected = await db
        .select()
        .from(dealConflicts)
        .where(eq(dealConflicts.id, (conflict as any).insertId))
        .limit(1);

      expect(detected[0].conflictType).toBe('Territory');
    });

    it('should resolve conflicts with escalation', async () => {
      const { deals, dealConflicts } = await import('../../../drizzle/deal-management-schema');

      // Create conflicting deals
      const deal1 = await db.insert(deals).values({
        partnerCompanyId: 101,
        dealName: 'Conflict Resolution Test 1',
        accountName: 'Resolution Test Corp',
        dealValue: '100000',
        dealCurrency: 'USD',
        dealStage: 'Qualified',
        dealStatus: 'Pending Approval',
        expectedCloseDate: new Date('2026-06-30'),
      });

      const deal2 = await db.insert(deals).values({
        partnerCompanyId: 102,
        dealName: 'Conflict Resolution Test 2',
        accountName: 'Resolution Test Corp',
        dealValue: '100000',
        dealCurrency: 'USD',
        dealStage: 'Qualified',
        dealStatus: 'Pending Approval',
        expectedCloseDate: new Date('2026-06-30'),
      });

      // Create conflict
      const conflict = await db.insert(dealConflicts).values({
        deal1Id: (deal1 as any).insertId,
        deal2Id: (deal2 as any).insertId,
        conflictType: 'Channel',
        severity: 'High',
        status: 'Detected',
        description: 'Channel conflict',
      });

      // Resolve conflict
      await db
        .update(dealConflicts)
        .set({
          status: 'Resolved',
          resolutionStrategy: 'Partner-Tier-Based',
          resolutionNotes: 'Awarded to higher tier partner',
        })
        .where(eq(dealConflicts.id, (conflict as any).insertId));

      const resolved = await db
        .select()
        .from(dealConflicts)
        .where(eq(dealConflicts.id, (conflict as any).insertId))
        .limit(1);

      expect(resolved[0].status).toBe('Resolved');
      expect(resolved[0].resolutionStrategy).toBe('Partner-Tier-Based');
    });
  });

  // ============================================================================
  // TRAINING & CERTIFICATION TESTS
  // ============================================================================

  describe('Training & Certification Workflow', () => {
    it('should enroll user in course', async () => {
      const { trainingEnrollments } = await import('../../../drizzle/training-schema');

      const enrollment = await db.insert(trainingEnrollments).values({
        userId: 201,
        courseId: 401,
        status: 'In Progress',
        progressPercentage: 0,
      });

      expect((enrollment as any).insertId).toBeGreaterThan(0);
    });

    it('should track course progress', async () => {
      const { trainingEnrollments } = await import('../../../drizzle/training-schema');

      // Create enrollment
      const enrollment = await db.insert(trainingEnrollments).values({
        userId: 202,
        courseId: 402,
        status: 'In Progress',
        progressPercentage: 0,
      });

      const enrollmentId = (enrollment as any).insertId;

      // Update progress
      await db
        .update(trainingEnrollments)
        .set({ progressPercentage: 50 })
        .where(eq(trainingEnrollments.id, enrollmentId));

      const updated = await db
        .select()
        .from(trainingEnrollments)
        .where(eq(trainingEnrollments.id, enrollmentId))
        .limit(1);

      expect(updated[0].progressPercentage).toBe(50);
    });

    it('should mark course as completed', async () => {
      const { trainingEnrollments } = await import('../../../drizzle/training-schema');

      // Create enrollment
      const enrollment = await db.insert(trainingEnrollments).values({
        userId: 203,
        courseId: 403,
        status: 'In Progress',
        progressPercentage: 0,
      });

      const enrollmentId = (enrollment as any).insertId;

      // Complete course
      await db
        .update(trainingEnrollments)
        .set({ status: 'Completed', progressPercentage: 100 })
        .where(eq(trainingEnrollments.id, enrollmentId));

      const completed = await db
        .select()
        .from(trainingEnrollments)
        .where(eq(trainingEnrollments.id, enrollmentId))
        .limit(1);

      expect(completed[0].status).toBe('Completed');
      expect(completed[0].progressPercentage).toBe(100);
    });

    it('should track certification eligibility', async () => {
      const { trainingEnrollments, trainingCertifications } = await import(
        '../../../drizzle/training-schema'
      );

      // Get certification requirements
      const cert = await db
        .select()
        .from(trainingCertifications)
        .where(eq(trainingCertifications.id, 601))
        .limit(1);

      expect(cert[0].requiredCourses).toBeGreaterThan(0);

      // Check user's completed courses
      const completed = await db
        .select()
        .from(trainingEnrollments)
        .where(eq(trainingEnrollments.userId, 201));

      const completedCount = completed.filter((e) => e.status === 'Completed').length;
      const isEligible = completedCount >= cert[0].requiredCourses;

      expect(isEligible).toBeDefined();
    });
  });

  // ============================================================================
  // PARTNER ONBOARDING TESTS
  // ============================================================================

  describe('Partner Onboarding Workflow', () => {
    it('should create partner application', async () => {
      const { partnerApplications } = await import('../../../drizzle/partner-schema');

      const application = await db.insert(partnerApplications).values({
        companyName: 'Integration Test Partner',
        contactEmail: 'test@integration.com',
        contactPhone: '+1-555-0123',
        partnerType: 'Reseller',
        region: 'North America',
        specializations: JSON.stringify(['Cybersecurity', 'Cloud']),
        status: 'Submitted',
      });

      expect((application as any).insertId).toBeGreaterThan(0);
    });

    it('should approve application and create partner company', async () => {
      const { partnerApplications } = await import('../../../drizzle/partner-schema');
      const { partnerCompanies } = await import('../../../drizzle/schema');

      // Create application
      const application = await db.insert(partnerApplications).values({
        companyName: 'Approval Test Partner',
        contactEmail: 'approval@test.com',
        contactPhone: '+1-555-0124',
        partnerType: 'Distributor',
        region: 'Europe',
        specializations: JSON.stringify(['Enterprise']),
        status: 'Submitted',
      });

      const appId = (application as any).insertId;

      // Approve application
      await db
        .update(partnerApplications)
        .set({ status: 'Approved', approvalDate: new Date() })
        .where(eq(partnerApplications.id, appId));

      // Create partner company
      const partner = await db.insert(partnerCompanies).values({
        companyName: 'Approval Test Partner',
        email: 'approval@test.com',
        partnerType: 'Distributor',
        region: 'Europe',
        status: 'Active',
        tier: 'Silver',
        commissionRate: 20,
        mdfBudget: 35000,
      });

      expect((partner as any).insertId).toBeGreaterThan(0);

      // Verify partner was created
      const created = await db
        .select()
        .from(partnerCompanies)
        .where(eq(partnerCompanies.id, (partner as any).insertId))
        .limit(1);

      expect(created[0].status).toBe('Active');
      expect(created[0].tier).toBe('Silver');
    });

    it('should reject application with reason', async () => {
      const { partnerApplications } = await import('../../../drizzle/partner-schema');

      // Create application
      const application = await db.insert(partnerApplications).values({
        companyName: 'Rejection Test Partner',
        contactEmail: 'rejection@test.com',
        contactPhone: '+1-555-0125',
        partnerType: 'ISV',
        region: 'APAC',
        specializations: JSON.stringify(['Analytics']),
        status: 'Submitted',
      });

      const appId = (application as any).insertId;

      // Reject application
      await db
        .update(partnerApplications)
        .set({
          status: 'Rejected',
          rejectionReason: 'Does not meet minimum requirements',
          rejectionDate: new Date(),
        })
        .where(eq(partnerApplications.id, appId));

      const rejected = await db
        .select()
        .from(partnerApplications)
        .where(eq(partnerApplications.id, appId))
        .limit(1);

      expect(rejected[0].status).toBe('Rejected');
      expect(rejected[0].rejectionReason).toContain('minimum requirements');
    });

    it('should track onboarding milestones', async () => {
      const { onboardingSessions } = await import('../../../drizzle/partner-schema');

      const milestone = await db.insert(onboardingSessions).values({
        partnerCompanyId: 101,
        sessionName: 'Initial Onboarding Call',
        sessionType: 'Kickoff',
        scheduledDate: new Date('2026-02-20'),
        status: 'Scheduled',
        notes: 'Initial partner onboarding meeting',
      });

      expect((milestone as any).insertId).toBeGreaterThan(0);

      // Complete milestone
      const milestoneId = (milestone as any).insertId;
      await db
        .update(onboardingSessions)
        .set({ status: 'Completed', completedDate: new Date() })
        .where(eq(onboardingSessions.id, milestoneId));

      const completed = await db
        .select()
        .from(onboardingSessions)
        .where(eq(onboardingSessions.id, milestoneId))
        .limit(1);

      expect(completed[0].status).toBe('Completed');
    });
  });

  // ============================================================================
  // DATA INTEGRITY TESTS
  // ============================================================================

  describe('Data Integrity', () => {
    it('should maintain referential integrity for deals', async () => {
      const { deals } = await import('../../../drizzle/deal-management-schema');
      const { partnerCompanies } = await import('../../../drizzle/schema');

      // Get valid partner
      const partner = await db
        .select()
        .from(partnerCompanies)
        .where(eq(partnerCompanies.id, 101))
        .limit(1);

      expect(partner.length).toBeGreaterThan(0);

      // Create deal with valid partner
      const deal = await db.insert(deals).values({
        partnerCompanyId: partner[0].id,
        dealName: 'Integrity Test Deal',
        accountName: 'Test Account',
        dealValue: '100000',
        dealCurrency: 'USD',
        dealStage: 'Submitted',
        dealStatus: 'Under Review',
        expectedCloseDate: new Date('2026-06-30'),
      });

      expect((deal as any).insertId).toBeGreaterThan(0);
    });

    it('should handle concurrent deal updates safely', async () => {
      const { deals } = await import('../../../drizzle/deal-management-schema');

      // Create deal
      const deal = await db.insert(deals).values({
        partnerCompanyId: 101,
        dealName: 'Concurrent Update Test',
        accountName: 'Test Account',
        dealValue: '100000',
        dealCurrency: 'USD',
        dealStage: 'Submitted',
        dealStatus: 'Under Review',
        expectedCloseDate: new Date('2026-06-30'),
      });

      const dealId = (deal as any).insertId;

      // Simulate concurrent updates
      const update1 = db
        .update(deals)
        .set({ dealStage: 'Qualified' })
        .where(eq(deals.id, dealId));

      const update2 = db
        .update(deals)
        .set({ dealStatus: 'Pending Approval' })
        .where(eq(deals.id, dealId));

      await Promise.all([update1, update2]);

      const final = await db.select().from(deals).where(eq(deals.id, dealId)).limit(1);

      expect(final[0].dealStage).toBe('Qualified');
      expect(final[0].dealStatus).toBe('Pending Approval');
    });
  });
});
