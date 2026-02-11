#!/usr/bin/env node

/**
 * Test Data Seeding Script
 * Populates the database with test data for partner portal testing
 * 
 * Usage: node scripts/seed-test-data.mjs
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable not set');
  process.exit(1);
}

// Parse MySQL connection string
function parseConnectionString(url) {
  const match = url.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (!match) {
    throw new Error('Invalid DATABASE_URL format');
  }
  return {
    user: match[1],
    password: match[2],
    host: match[3],
    port: parseInt(match[4]),
    database: match[5],
  };
}

async function seedTestData() {
  const config = parseConnectionString(DATABASE_URL);
  const connection = await mysql.createConnection(config);

  try {
    console.log('🌱 Starting test data seeding...\n');

    // 1. Seed Partner Companies
    console.log('📝 Creating test partner companies...');
    const partners = [
      {
        id: 101,
        companyName: 'TechVision Solutions',
        email: 'contact@techvision.com',
        website: 'https://techvision.com',
        partnerType: 'Reseller',
        region: 'North America',
        status: 'Active',
        tier: 'Gold',
        commissionRate: 25,
        mdfBudget: 50000,
      },
      {
        id: 102,
        companyName: 'SecureNet Partners',
        email: 'sales@securenet.com',
        website: 'https://securenet.com',
        partnerType: 'MSP',
        region: 'Europe',
        status: 'Active',
        tier: 'Silver',
        commissionRate: 20,
        mdfBudget: 35000,
      },
      {
        id: 103,
        companyName: 'CloudFirst Integrators',
        email: 'info@cloudfirst.com',
        website: 'https://cloudfirst.com',
        partnerType: 'Distributor',
        region: 'APAC',
        status: 'Prospect',
        tier: 'Standard',
        commissionRate: 15,
        mdfBudget: 20000,
      },
      {
        id: 104,
        companyName: 'Enterprise Defense Corp',
        email: 'partnerships@entdef.com',
        website: 'https://entdef.com',
        partnerType: 'ISV',
        region: 'North America',
        status: 'Active',
        tier: 'Platinum',
        commissionRate: 30,
        mdfBudget: 75000,
      },
    ];

    for (const partner of partners) {
      await connection.execute(
        `INSERT IGNORE INTO partner_companies 
         (id, companyName, email, website, partnerType, region, status, tier, commissionRate, mdfBudget, createdAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          partner.id,
          partner.companyName,
          partner.email,
          partner.website,
          partner.partnerType,
          partner.region,
          partner.status,
          partner.tier,
          partner.commissionRate,
          partner.mdfBudget,
        ]
      );
      console.log(`  ✓ Created partner: ${partner.companyName}`);
    }

    // 2. Seed Partner Users
    console.log('\n👥 Creating test partner users...');
    const users = [
      {
        id: 201,
        partnerCompanyId: 101,
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@techvision.com',
        role: 'Partner Admin',
        status: 'Active',
      },
      {
        id: 202,
        partnerCompanyId: 101,
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@techvision.com',
        role: 'Sales Manager',
        status: 'Active',
      },
      {
        id: 203,
        partnerCompanyId: 102,
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.chen@securenet.com',
        role: 'Partner Admin',
        status: 'Active',
      },
      {
        id: 204,
        partnerCompanyId: 103,
        firstName: 'Emma',
        lastName: 'Williams',
        email: 'emma.williams@cloudfirst.com',
        role: 'Sales Rep',
        status: 'Pending',
      },
    ];

    for (const user of users) {
      await connection.execute(
        `INSERT IGNORE INTO partner_users 
         (id, partnerCompanyId, firstName, lastName, email, role, status, createdAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          user.id,
          user.partnerCompanyId,
          user.firstName,
          user.lastName,
          user.email,
          user.role,
          user.status,
        ]
      );
      console.log(`  ✓ Created user: ${user.firstName} ${user.lastName}`);
    }

    // 3. Seed Test Deals
    console.log('\n💼 Creating test deals...');
    const deals = [
      {
        id: 301,
        partnerCompanyId: 101,
        dealName: 'Acme Corp Security Upgrade',
        accountName: 'Acme Corporation',
        dealValue: 150000,
        dealCurrency: 'USD',
        dealStage: 'Qualified',
        dealStatus: 'Pending Approval',
        expectedCloseDate: '2026-03-31',
        description: 'Enterprise cybersecurity platform implementation',
      },
      {
        id: 302,
        partnerCompanyId: 101,
        dealName: 'Global Tech Infrastructure Deal',
        accountName: 'Global Tech Inc',
        dealValue: 250000,
        dealCurrency: 'USD',
        dealStage: 'Approved',
        dealStatus: 'Won',
        expectedCloseDate: '2026-02-28',
        description: 'Multi-region threat detection deployment',
      },
      {
        id: 303,
        partnerCompanyId: 102,
        dealName: 'European Bank Compliance',
        accountName: 'EuroBank AG',
        dealValue: 180000,
        dealCurrency: 'EUR',
        dealStage: 'Submitted',
        dealStatus: 'Under Review',
        expectedCloseDate: '2026-04-15',
        description: 'Compliance-focused analytics platform',
      },
      {
        id: 304,
        partnerCompanyId: 103,
        dealName: 'Asia Pacific Expansion',
        accountName: 'AsiaTech Solutions',
        dealValue: 95000,
        dealCurrency: 'USD',
        dealStage: 'Qualified',
        dealStatus: 'Pending Approval',
        expectedCloseDate: '2026-05-30',
        description: 'Regional threat intelligence integration',
      },
    ];

    for (const deal of deals) {
      await connection.execute(
        `INSERT IGNORE INTO deals 
         (id, partnerCompanyId, dealName, accountName, dealValue, dealCurrency, dealStage, dealStatus, expectedCloseDate, description, createdAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          deal.id,
          deal.partnerCompanyId,
          deal.dealName,
          deal.accountName,
          deal.dealValue,
          deal.dealCurrency,
          deal.dealStage,
          deal.dealStatus,
          deal.expectedCloseDate,
          deal.description,
        ]
      );
      console.log(`  ✓ Created deal: ${deal.dealName}`);
    }

    // 4. Seed Training Courses
    console.log('\n📚 Creating test training courses...');
    const courses = [
      {
        id: 401,
        courseName: 'TruContext Platform Fundamentals',
        courseCode: 'TC-101',
        description: 'Introduction to TruContext platform features and capabilities',
        category: 'Sales',
        duration: 120,
        level: 'Beginner',
        status: 'Published',
      },
      {
        id: 402,
        courseName: 'Advanced Threat Detection',
        courseCode: 'TC-201',
        description: 'Deep dive into threat detection and analysis techniques',
        category: 'Technical',
        duration: 240,
        level: 'Advanced',
        status: 'Published',
      },
      {
        id: 403,
        courseName: 'Sales Enablement Bootcamp',
        courseCode: 'TC-301',
        description: 'Comprehensive sales training and deal strategies',
        category: 'Sales',
        duration: 180,
        level: 'Intermediate',
        status: 'Published',
      },
      {
        id: 404,
        courseName: 'Executive Briefing',
        courseCode: 'TC-401',
        description: 'C-level overview of TruContext value proposition',
        category: 'Executive',
        duration: 60,
        level: 'Beginner',
        status: 'Published',
      },
    ];

    for (const course of courses) {
      await connection.execute(
        `INSERT IGNORE INTO training_courses 
         (id, courseName, courseCode, description, category, duration, level, status, createdAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          course.id,
          course.courseName,
          course.courseCode,
          course.description,
          course.category,
          course.duration,
          course.level,
          course.status,
        ]
      );
      console.log(`  ✓ Created course: ${course.courseName}`);
    }

    // 5. Seed Course Enrollments
    console.log('\n✍️  Creating test course enrollments...');
    const enrollments = [
      { id: 501, userId: 201, courseId: 401, status: 'Completed', progressPercentage: 100 },
      { id: 502, userId: 201, courseId: 402, status: 'In Progress', progressPercentage: 65 },
      { id: 503, userId: 202, courseId: 401, status: 'Completed', progressPercentage: 100 },
      { id: 504, userId: 203, courseId: 403, status: 'In Progress', progressPercentage: 40 },
      { id: 505, userId: 204, courseId: 401, status: 'Not Started', progressPercentage: 0 },
    ];

    for (const enrollment of enrollments) {
      await connection.execute(
        `INSERT IGNORE INTO training_enrollments 
         (id, userId, courseId, status, progressPercentage, enrolledAt) 
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [
          enrollment.id,
          enrollment.userId,
          enrollment.courseId,
          enrollment.status,
          enrollment.progressPercentage,
        ]
      );
      console.log(`  ✓ Created enrollment: User ${enrollment.userId} → Course ${enrollment.courseId}`);
    }

    // 6. Seed Certifications
    console.log('\n🏆 Creating test certifications...');
    const certifications = [
      {
        id: 601,
        certificationName: 'TruContext Certified Sales Professional',
        certCode: 'TCSP',
        description: 'Validates sales expertise with TruContext platform',
        requiredCourses: 2,
        expirationMonths: 12,
      },
      {
        id: 602,
        certificationName: 'TruContext Certified Technical Expert',
        certCode: 'TCTE',
        description: 'Validates technical proficiency and implementation skills',
        requiredCourses: 3,
        expirationMonths: 24,
      },
    ];

    for (const cert of certifications) {
      await connection.execute(
        `INSERT IGNORE INTO training_certifications 
         (id, certificationName, certCode, description, requiredCourses, expirationMonths, createdAt) 
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [
          cert.id,
          cert.certificationName,
          cert.certCode,
          cert.description,
          cert.requiredCourses,
          cert.expirationMonths,
        ]
      );
      console.log(`  ✓ Created certification: ${cert.certificationName}`);
    }

    // 7. Seed Approval Workflows
    console.log('\n🔄 Creating test approval workflows...');
    const workflows = [
      {
        id: 701,
        workflowName: 'Standard Deal Approval',
        workflowCode: 'WF-STD',
        template: 'Standard',
        status: 'Active',
        minDealValue: 0,
        maxDealValue: 500000,
      },
      {
        id: 702,
        workflowName: 'Executive Review Process',
        workflowCode: 'WF-EXEC',
        template: 'Executive',
        status: 'Active',
        minDealValue: 500000,
        maxDealValue: null,
      },
    ];

    for (const workflow of workflows) {
      await connection.execute(
        `INSERT IGNORE INTO approval_workflows 
         (id, workflowName, workflowCode, template, status, minDealValue, maxDealValue, createdAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          workflow.id,
          workflow.workflowName,
          workflow.workflowCode,
          workflow.template,
          workflow.status,
          workflow.minDealValue,
          workflow.maxDealValue,
        ]
      );
      console.log(`  ✓ Created workflow: ${workflow.workflowName}`);
    }

    // 8. Seed Conflict Policies
    console.log('\n⚠️  Creating test conflict policies...');
    const policies = [
      {
        id: 801,
        policyName: 'Channel Conflict Prevention',
        policyCode: 'CP-CHANNEL',
        conflictType: 'Channel',
        defaultSeverity: 'High',
        autoResolve: false,
        isActive: true,
      },
      {
        id: 802,
        policyName: 'Territory Protection',
        policyCode: 'CP-TERRITORY',
        conflictType: 'Territory',
        defaultSeverity: 'Medium',
        autoResolve: true,
        isActive: true,
      },
      {
        id: 803,
        policyName: 'Customer Exclusivity',
        policyCode: 'CP-CUSTOMER',
        conflictType: 'Customer',
        defaultSeverity: 'High',
        autoResolve: false,
        isActive: true,
      },
    ];

    for (const policy of policies) {
      await connection.execute(
        `INSERT IGNORE INTO conflict_policies 
         (id, policyName, policyCode, conflictType, defaultSeverity, autoResolve, isActive, createdAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          policy.id,
          policy.policyName,
          policy.policyCode,
          policy.conflictType,
          policy.defaultSeverity,
          policy.autoResolve,
          policy.isActive,
        ]
      );
      console.log(`  ✓ Created policy: ${policy.policyName}`);
    }

    console.log('\n✅ Test data seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log('  • 4 Partner Companies');
    console.log('  • 4 Partner Users');
    console.log('  • 4 Test Deals');
    console.log('  • 4 Training Courses');
    console.log('  • 5 Course Enrollments');
    console.log('  • 2 Certifications');
    console.log('  • 2 Approval Workflows');
    console.log('  • 3 Conflict Policies\n');

  } catch (error) {
    console.error('❌ Error seeding test data:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seedTestData();
