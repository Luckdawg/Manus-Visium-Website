# Schema Mismatch Analysis - Deal Registration Workflow

## Critical Issues Found

### 1. **dealAmount Field Type Mismatch**
- **Database Schema**: `dealAmount: decimal("dealAmount", { precision: 15, scale: 2 })`
- **Current Code**: `dealAmount: input.dealValue.toString()` (converting number to string)
- **Issue**: Decimal fields should receive numeric values, not strings
- **Fix**: Pass as `parseFloat(input.dealValue)` or just `input.dealValue`

### 2. **Missing Required Field: submittedBy**
- **Database Schema**: `submittedBy: int("submittedBy").notNull()` - REQUIRED
- **Current Code**: ✅ Correctly set to `ctx.user.id`
- **Status**: OK

### 3. **Field Name Mismatch: estimatedCloseDate vs expectedCloseDate**
- **Form sends**: `estimatedCloseDate` (string)
- **Database expects**: `expectedCloseDate` (timestamp)
- **Current Code**: ✅ Correctly mapped to `expectedCloseDate`
- **Status**: OK

### 4. **customerName Field Mapping**
- **Form sends**: `customerCompanyName`
- **Database expects**: `customerName` (varchar, not null)
- **Current Code**: ✅ Correctly mapped to `customerName`
- **Status**: OK

### 5. **Missing Fields Not Sent by Form**
The form doesn't send these required/important fields:
- `customerEmail` - Optional but important
- `customerPhone` - Optional
- `customerIndustry` - Optional
- `customerSize` - Optional enum
- `productInterest` - Optional (JSON array)
- `commissionPercentage` - Optional
- `internalOwner` - Optional (Visium user)

### 6. **dealStage Field**
- **Form sends**: `salesStage` (optional string)
- **Database expects**: `dealStage` (enum with specific values)
- **Current Code**: ✅ Correctly mapped and defaults to "Prospecting"
- **Valid values**: Prospecting, Qualification, Needs Analysis, Proposal, Negotiation, Closed Won, Closed Lost
- **Status**: OK

### 7. **description Field**
- **Form sends**: `dealType` (optional string)
- **Database expects**: `description` (text field)
- **Current Code**: ✅ Mapped but should be more descriptive
- **Status**: OK but could be improved

## Database Schema Details

```typescript
export const partnerDeals = mysqlTable("partner_deals", {
  id: int("id").autoincrement().primaryKey(),
  dealName: varchar("dealName", { length: 255 }).notNull(),
  partnerCompanyId: int("partnerCompanyId").notNull(),
  
  // Customer information
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }),
  customerPhone: varchar("customerPhone", { length: 50 }),
  customerIndustry: varchar("customerIndustry", { length: 100 }),
  customerSize: mysqlEnum("customerSize", [
    "Startup", "SMB", "Mid-Market", "Enterprise", "Government"
  ]),
  
  // Deal details
  dealAmount: decimal("dealAmount", { precision: 15, scale: 2 }).notNull(),
  dealStage: mysqlEnum("dealStage", [
    "Prospecting", "Qualification", "Needs Analysis", "Proposal", 
    "Negotiation", "Closed Won", "Closed Lost"
  ]).default("Prospecting").notNull(),
  
  expectedCloseDate: timestamp("expectedCloseDate"),
  closedDate: timestamp("closedDate"),
  
  // Product/service
  productInterest: text("productInterest"), // JSON array
  description: text("description"),
  
  // Commission tracking
  commissionPercentage: decimal("commissionPercentage", { precision: 5, scale: 2 }),
  commissionAmount: decimal("commissionAmount", { precision: 15, scale: 2 }),
  commissionPaid: boolean("commissionPaid").default(false),
  commissionPaidDate: timestamp("commissionPaidDate"),
  
  // Metadata
  submittedBy: int("submittedBy").notNull(),
  internalOwner: int("internalOwner"),
  notes: text("notes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
```

## Form Data Structure

```typescript
const dealData = {
  customerCompanyName,      // Maps to: customerName
  dealName,                 // Maps to: dealName ✓
  dealValue,                // Maps to: dealAmount (needs numeric conversion)
  estimatedCloseDate,       // Maps to: expectedCloseDate ✓
  salesStage,               // Maps to: dealStage ✓
  dealType,                 // Maps to: description ✓
  primaryContactEmail,      // Maps to: customerEmail (optional)
};
```

## Recommended Fixes

1. **Update submitDeal input validation** to accept all customer fields
2. **Fix decimal handling** - ensure dealAmount is numeric
3. **Enhance form** to capture customerEmail, customerPhone, customerIndustry, customerSize
4. **Add productInterest** field to form (multi-select)
5. **Add commission tracking** fields if needed
6. **Add validation** for dealStage enum values
7. **Test end-to-end** with actual database insert

## Implementation Plan

1. Update Zod schema in submitDeal procedure
2. Update DealRegistration form to capture all fields
3. Fix type conversions (decimal handling)
4. Add proper error handling
5. Create integration tests
6. Verify admin sees submitted deals
