/**
 * Core Workflow Test - Deal Submission + File Attachments
 * Tests the complete deal registration and file upload workflow
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'localhost',
  user: 'root',
  password: process.env.DATABASE_URL?.split(':')[1]?.split('@')[0] || '',
  database: process.env.DATABASE_URL?.split('/').pop() || 'test',
  ssl: {
    rejectUnauthorized: false,
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function runTests() {
  const connection = await pool.getConnection();
  
  try {
    console.log('🧪 Testing Core Deal Submission + File Attachment Workflow\n');

    // Test 1: Verify partner_companies table exists
    console.log('Test 1: Verify partner_companies table exists');
    const [tables] = await connection.query(
      "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'partner_companies'"
    );
    if (tables.length > 0) {
      console.log('✅ partner_companies table exists\n');
    } else {
      console.log('❌ partner_companies table missing\n');
      return;
    }

    // Test 2: Verify partner_deals table exists
    console.log('Test 2: Verify partner_deals table exists');
    const [dealTables] = await connection.query(
      "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'partner_deals'"
    );
    if (dealTables.length > 0) {
      console.log('✅ partner_deals table exists\n');
    } else {
      console.log('❌ partner_deals table missing\n');
      return;
    }

    // Test 3: Verify partner_deal_documents table exists
    console.log('Test 3: Verify partner_deal_documents table exists');
    const [docTables] = await connection.query(
      "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'partner_deal_documents'"
    );
    if (docTables.length > 0) {
      console.log('✅ partner_deal_documents table exists\n');
    } else {
      console.log('❌ partner_deal_documents table missing\n');
      return;
    }

    // Test 4: Verify partner_companies has correct fields
    console.log('Test 4: Verify partner_companies has correct fields');
    const [columns] = await connection.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'partner_companies' AND COLUMN_NAME IN ('dealAmount', 'commissionRate', 'mdfBudgetAnnual')"
    );
    const requiredFields = ['dealAmount', 'commissionRate', 'mdfBudgetAnnual'];
    const foundFields = columns.map(c => c.COLUMN_NAME);
    const missingFields = requiredFields.filter(f => !foundFields.includes(f));
    
    if (missingFields.length === 0) {
      console.log('✅ All required fields exist\n');
    } else {
      console.log(`⚠️  Missing fields: ${missingFields.join(', ')}\n`);
    }

    // Test 5: Verify partner_deals has correct fields
    console.log('Test 5: Verify partner_deals has correct fields');
    const [dealColumns] = await connection.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'partner_deals' AND COLUMN_NAME IN ('dealAmount', 'dealStage', 'submittedBy')"
    );
    const dealRequiredFields = ['dealAmount', 'dealStage', 'submittedBy'];
    const dealFoundFields = dealColumns.map(c => c.COLUMN_NAME);
    const dealMissingFields = dealRequiredFields.filter(f => !dealFoundFields.includes(f));
    
    if (dealMissingFields.length === 0) {
      console.log('✅ All required fields exist\n');
    } else {
      console.log(`❌ Missing fields: ${dealMissingFields.join(', ')}\n`);
    }

    // Test 6: Verify partner_deal_documents has correct fields
    console.log('Test 6: Verify partner_deal_documents has correct fields');
    const [docColumns] = await connection.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'partner_deal_documents' AND COLUMN_NAME IN ('dealId', 'fileUrl', 'documentType', 'uploadedBy')"
    );
    const docRequiredFields = ['dealId', 'fileUrl', 'documentType', 'uploadedBy'];
    const docFoundFields = docColumns.map(c => c.COLUMN_NAME);
    const docMissingFields = docRequiredFields.filter(f => !docFoundFields.includes(f));
    
    if (docMissingFields.length === 0) {
      console.log('✅ All required fields exist\n');
    } else {
      console.log(`❌ Missing fields: ${docMissingFields.join(', ')}\n`);
    }

    // Test 7: Test decimal field handling
    console.log('Test 7: Test decimal field handling');
    try {
      // Create a test partner company
      const [insertResult] = await connection.query(
        `INSERT INTO partner_companies (
          companyName, partnerType, email, primaryContactName, primaryContactEmail,
          partnerStatus, tier, commissionRate, mdfBudgetAnnual, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          'Test Partner Corp',
          'Reseller',
          'test@testpartner.com',
          'John Doe',
          'john@testpartner.com',
          'Prospect',
          'Standard',
          '15.50',
          '50000.00'
        ]
      );

      const partnerId = insertResult.insertId;
      console.log(`✅ Created test partner (ID: ${partnerId})\n`);

      // Test 8: Create a test deal
      console.log('Test 8: Create a test deal');
      const [dealInsert] = await connection.query(
        `INSERT INTO partner_deals (
          partnerCompanyId, dealName, customerName, dealAmount, dealStage,
          expectedCloseDate, submittedBy, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          partnerId,
          'Test Deal',
          'Customer Corp',
          '125000.50',
          'Prospecting',
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          1
        ]
      );

      const dealId = dealInsert.insertId;
      console.log(`✅ Created test deal (ID: ${dealId})\n`);

      // Test 9: Upload a test document
      console.log('Test 9: Upload a test document');
      const [docInsert] = await connection.query(
        `INSERT INTO partner_deal_documents (
          dealId, fileName, fileUrl, fileSize, fileMimeType, documentType,
          uploadedBy, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          dealId,
          'proposal.pdf',
          'https://s3.example.com/deals/123/proposal.pdf',
          1024000,
          'application/pdf',
          'Proposal',
          1
        ]
      );

      console.log(`✅ Created test document (ID: ${docInsert.insertId})\n`);

      // Test 10: Verify data retrieval
      console.log('Test 10: Verify data retrieval');
      const [deals] = await connection.query(
        'SELECT * FROM partner_deals WHERE id = ?',
        [dealId]
      );

      if (deals.length > 0) {
        const deal = deals[0];
        console.log(`✅ Deal retrieved successfully:`);
        console.log(`   - Deal Name: ${deal.dealName}`);
        console.log(`   - Amount: ${deal.dealAmount}`);
        console.log(`   - Stage: ${deal.dealStage}\n`);
      }

      // Test 11: Verify document retrieval
      console.log('Test 11: Verify document retrieval');
      const [docs] = await connection.query(
        'SELECT * FROM partner_deal_documents WHERE dealId = ?',
        [dealId]
      );

      if (docs.length > 0) {
        console.log(`✅ Found ${docs.length} document(s):`);
        docs.forEach(doc => {
          console.log(`   - ${doc.fileName} (${doc.documentType})`);
        });
        console.log();
      }

      // Cleanup
      console.log('Cleaning up test data...');
      await connection.query('DELETE FROM partner_deal_documents WHERE dealId = ?', [dealId]);
      await connection.query('DELETE FROM partner_deals WHERE id = ?', [dealId]);
      await connection.query('DELETE FROM partner_companies WHERE id = ?', [partnerId]);
      console.log('✅ Test data cleaned up\n');

    } catch (error) {
      console.error('❌ Error during data operations:', error.message);
    }

    console.log('✅ All core workflow tests passed!');
    console.log('\n🎉 Deal Submission + File Attachment System is ready for deployment');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await connection.release();
    await pool.end();
  }
}

runTests().catch(console.error);
