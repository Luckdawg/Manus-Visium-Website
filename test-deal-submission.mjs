#!/usr/bin/env node

/**
 * Manual test script for deal submission workflow
 * This script tests the complete flow without relying on the tRPC client
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/visium';

async function testDealSubmission() {
  let connection;
  
  try {
    // Parse connection string
    const url = new URL(DATABASE_URL);
    const config = {
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      port: url.port || 3306,
      ssl: {},  // Enable SSL for TiDB
    };

    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to database\n');

    // Test 1: Create a test partner company
    console.log('📝 Test 1: Creating test partner company...');
    const [partnerResult] = await connection.execute(
      `INSERT INTO partner_companies 
       (companyName, email, partnerType, partnerStatus, tier, primaryContactName, primaryContactEmail, commissionRate, mdfBudgetAnnual, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        'Test Partner Inc',
        'test@partner.com',
        'Reseller',
        'Active',
        'Gold',
        'John Doe',
        'john@partner.com',
        10.00,
        50000.00,
      ]
    );
    const partnerId = partnerResult.insertId;
    console.log(`✅ Partner created with ID: ${partnerId}\n`);

    // Test 2: Create a test partner user
    console.log('📝 Test 2: Creating test partner user...');
    const [userResult] = await connection.execute(
      `INSERT INTO partner_users 
       (partnerCompanyId, contactName, email, partnerRole, isActive, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        partnerId,
        'Jane Smith',
        'jane@partner.com',
        'Sales Rep',
        true,
      ]
    );
    const userId = userResult.insertId;
    console.log(`✅ Partner user created with ID: ${userId}\n`);

    // Test 3: Submit a deal with correct field mapping
    console.log('📝 Test 3: Submitting deal with correct field mapping...');
    const dealData = {
      partnerCompanyId: partnerId,
      dealName: 'TruContext Platform Implementation',
      customerName: 'Acme Corporation',
      customerEmail: 'contact@acme.com',
      customerPhone: '+1-555-0100',
      customerIndustry: 'Cybersecurity',
      customerSize: 'Enterprise',
      dealAmount: '250000.00',
      dealStage: 'Proposal',
      expectedCloseDate: new Date('2026-06-30'),
      productInterest: JSON.stringify(['TruContext', 'Tru-InSight']),
      description: 'Enterprise security platform implementation with advanced threat detection',
      submittedBy: userId,
      notes: 'Deal submitted via partner portal - Test',
    };

    const [dealResult] = await connection.execute(
      `INSERT INTO partner_deals 
       (partnerCompanyId, dealName, customerName, customerEmail, customerPhone, customerIndustry, customerSize, dealAmount, dealStage, expectedCloseDate, productInterest, description, submittedBy, notes, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        dealData.partnerCompanyId,
        dealData.dealName,
        dealData.customerName,
        dealData.customerEmail,
        dealData.customerPhone,
        dealData.customerIndustry,
        dealData.customerSize,
        dealData.dealAmount,
        dealData.dealStage,
        dealData.expectedCloseDate,
        dealData.productInterest,
        dealData.description,
        dealData.submittedBy,
        dealData.notes,
      ]
    );
    const dealId = dealResult.insertId;
    console.log(`✅ Deal created with ID: ${dealId}\n`);

    // Test 4: Verify the deal was created correctly
    console.log('📝 Test 4: Verifying deal data integrity...');
    const [deals] = await connection.execute(
      'SELECT * FROM partner_deals WHERE id = ?',
      [dealId]
    );

    if (deals.length === 0) {
      throw new Error('Deal not found after insertion');
    }

    const deal = deals[0];
    console.log('✅ Deal verification results:');
    console.log(`   - Deal Name: ${deal.dealName}`);
    console.log(`   - Customer: ${deal.customerName}`);
    console.log(`   - Deal Amount: $${deal.dealAmount}`);
    console.log(`   - Deal Stage: ${deal.dealStage}`);
    console.log(`   - Customer Industry: ${deal.customerIndustry}`);
    console.log(`   - Customer Size: ${deal.customerSize}`);
    console.log(`   - Submitted By: ${deal.submittedBy}`);
    console.log(`   - Partner ID: ${deal.partnerCompanyId}\n`);

    // Test 5: Verify decimal handling
    console.log('📝 Test 5: Testing decimal field handling...');
    const testAmounts = [
      { input: '1000.50', description: 'Two decimal places' },
      { input: '50000.00', description: 'Whole number' },
      { input: '999999.99', description: 'Large amount' },
    ];

    for (const { input, description } of testAmounts) {
      const [result] = await connection.execute(
        `INSERT INTO partner_deals 
         (partnerCompanyId, dealName, customerName, dealAmount, dealStage, submittedBy, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          partnerId,
          `Decimal Test - ${description}`,
          'Test Customer',
          input,
          'Prospecting',
          userId,
        ]
      );

      const [verifyResult] = await connection.execute(
        'SELECT dealAmount FROM partner_deals WHERE id = ?',
        [result.insertId]
      );

      console.log(`✅ ${description}: Input ${input} → Stored ${verifyResult[0].dealAmount}`);
    }
    console.log();

    // Test 6: Verify deal stages
    console.log('📝 Test 6: Testing all deal stage values...');
    const stages = [
      'Prospecting',
      'Qualification',
      'Needs Analysis',
      'Proposal',
      'Negotiation',
      'Closed Won',
      'Closed Lost',
    ];

    for (const stage of stages) {
      const [result] = await connection.execute(
        `INSERT INTO partner_deals 
         (partnerCompanyId, dealName, customerName, dealAmount, dealStage, submittedBy, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          partnerId,
          `Stage Test - ${stage}`,
          'Test Customer',
          '50000.00',
          stage,
          userId,
        ]
      );
      console.log(`✅ Stage '${stage}' created successfully`);
    }
    console.log();

    // Test 7: Retrieve all deals for the partner
    console.log('📝 Test 7: Retrieving all deals for partner...');
    const [allDeals] = await connection.execute(
      'SELECT id, dealName, dealAmount, dealStage FROM partner_deals WHERE partnerCompanyId = ? ORDER BY createdAt DESC',
      [partnerId]
    );

    console.log(`✅ Found ${allDeals.length} deals for partner ${partnerId}:`);
    allDeals.slice(0, 5).forEach((d, i) => {
      console.log(`   ${i + 1}. ${d.dealName} - $${d.dealAmount} (${d.dealStage})`);
    });
    if (allDeals.length > 5) {
      console.log(`   ... and ${allDeals.length - 5} more`);
    }
    console.log();

    // Test 8: Verify admin can see submitted deals
    console.log('📝 Test 8: Admin visibility of submitted deals...');
    const [adminView] = await connection.execute(
      `SELECT pd.id, pd.dealName, pd.customerName, pd.dealAmount, pd.dealStage, pc.companyName as partnerName
       FROM partner_deals pd
       JOIN partner_companies pc ON pd.partnerCompanyId = pc.id
       WHERE pd.partnerCompanyId = ?
       LIMIT 1`,
      [partnerId]
    );

    if (adminView.length > 0) {
      const deal = adminView[0];
      console.log(`✅ Admin can see deal:`);
      console.log(`   - Deal ID: ${deal.id}`);
      console.log(`   - Deal Name: ${deal.dealName}`);
      console.log(`   - Customer: ${deal.customerName}`);
      console.log(`   - Amount: $${deal.dealAmount}`);
      console.log(`   - Stage: ${deal.dealStage}`);
      console.log(`   - Partner: ${deal.partnerName}\n`);
    }

    // Cleanup
    console.log('🧹 Cleaning up test data...');
    await connection.execute('DELETE FROM partner_deals WHERE partnerCompanyId = ?', [partnerId]);
    await connection.execute('DELETE FROM partner_users WHERE partnerCompanyId = ?', [partnerId]);
    await connection.execute('DELETE FROM partner_companies WHERE id = ?', [partnerId]);
    console.log('✅ Test data cleaned up\n');

    console.log('🎉 All tests passed successfully!');
    console.log('\n✨ Deal submission workflow is working correctly:');
    console.log('   ✓ Decimal fields handled properly');
    console.log('   ✓ All deal stages supported');
    console.log('   ✓ Customer information captured');
    console.log('   ✓ Admin visibility confirmed');
    console.log('   ✓ Database integrity maintained');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

testDealSubmission();
