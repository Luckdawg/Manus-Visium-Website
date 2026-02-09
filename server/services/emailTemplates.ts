/**
 * Default email templates for partner notifications
 * These templates use {{variableName}} syntax for variable substitution
 */

interface EmailTemplate {
  name: string;
  description: string;
  subject: string;
  htmlTemplate: string;
  textTemplate: string;
  variables: string[];
}

export const defaultEmailTemplates: Record<string, EmailTemplate> = {
  deal_submitted: {
    name: "Deal Submitted",
    description: "Sent when a partner submits a new deal",
    subject: "Deal Submitted: {{dealName}}",
    htmlTemplate: "<h2>Deal Submitted Successfully</h2><p>Hi {{partnerName}},</p><p>Thank you for submitting a new deal opportunity:</p><ul><li><strong>Deal Name:</strong> {{dealName}}</li><li><strong>Customer:</strong> {{customerName}}</li><li><strong>Deal Amount:</strong> ${{dealAmount}}</li><li><strong>Status:</strong> {{dealStage}}</li></ul><p>Our team will review this opportunity and get back to you shortly.</p><p>Best regards,<br/>Visium Technologies Team</p>",
    textTemplate: "Deal Submitted Successfully\n\nHi {{partnerName}},\n\nThank you for submitting a new deal opportunity:\n\nDeal Name: {{dealName}}\nCustomer: {{customerName}}\nDeal Amount: ${{dealAmount}}\nStatus: {{dealStage}}\n\nOur team will review this opportunity and get back to you shortly.\n\nBest regards,\nVisium Technologies Team",
    variables: ["partnerName", "dealName", "customerName", "dealAmount", "dealStage"],
  },

  deal_qualified: {
    name: "Deal Qualified",
    description: "Sent when a deal is qualified by the sales team",
    subject: "Deal Qualified: {{dealName}}",
    htmlTemplate: "<h2>Deal Qualified</h2><p>Hi {{partnerName}},</p><p>Great news! Your deal has been qualified and moved to the next stage:</p><ul><li><strong>Deal Name:</strong> {{dealName}}</li><li><strong>Customer:</strong> {{customerName}}</li><li><strong>Deal Amount:</strong> ${{dealAmount}}</li><li><strong>New Status:</strong> {{dealStage}}</li><li><strong>Commission:</strong> ${{commissionAmount}}</li></ul><p>We'll keep you updated on the progress of this opportunity.</p><p>Best regards,<br/>Visium Technologies Team</p>",
    textTemplate: "Deal Qualified\n\nHi {{partnerName}},\n\nGreat news! Your deal has been qualified and moved to the next stage:\n\nDeal Name: {{dealName}}\nCustomer: {{customerName}}\nDeal Amount: ${{dealAmount}}\nNew Status: {{dealStage}}\nCommission: ${{commissionAmount}}\n\nWe'll keep you updated on the progress of this opportunity.\n\nBest regards,\nVisium Technologies Team",
    variables: ["partnerName", "dealName", "customerName", "dealAmount", "dealStage", "commissionAmount"],
  },

  deal_won: {
    name: "Deal Won",
    description: "Sent when a deal is closed as won",
    subject: "Congratulations! Deal Won: {{dealName}}",
    htmlTemplate: "<h2>Congratulations! Deal Won</h2><p>Hi {{partnerName}},</p><p>Excellent news! Your deal has been successfully closed:</p><ul><li><strong>Deal Name:</strong> {{dealName}}</li><li><strong>Customer:</strong> {{customerName}}</li><li><strong>Deal Amount:</strong> ${{dealAmount}}</li><li><strong>Commission Earned:</strong> ${{commissionAmount}}</li></ul><p>Thank you for your partnership in bringing this opportunity to Visium. Your commission will be processed according to our standard payment terms.</p><p>Best regards,<br/>Visium Technologies Team</p>",
    textTemplate: "Congratulations! Deal Won\n\nHi {{partnerName}},\n\nExcellent news! Your deal has been successfully closed:\n\nDeal Name: {{dealName}}\nCustomer: {{customerName}}\nDeal Amount: ${{dealAmount}}\nCommission Earned: ${{commissionAmount}}\n\nThank you for your partnership in bringing this opportunity to Visium. Your commission will be processed according to our standard payment terms.\n\nBest regards,\nVisium Technologies Team",
    variables: ["partnerName", "dealName", "customerName", "dealAmount", "commissionAmount"],
  },

  deal_lost: {
    name: "Deal Lost",
    description: "Sent when a deal is closed as lost",
    subject: "Deal Status Update: {{dealName}}",
    htmlTemplate: "<h2>Deal Status Update</h2><p>Hi {{partnerName}},</p><p>We wanted to inform you that the following deal has been closed:</p><ul><li><strong>Deal Name:</strong> {{dealName}}</li><li><strong>Customer:</strong> {{customerName}}</li><li><strong>Deal Amount:</strong> ${{dealAmount}}</li><li><strong>Status:</strong> {{dealStage}}</li></ul><p>We appreciate your effort on this opportunity. Please don't hesitate to reach out if you have any questions or if there are other opportunities we can explore together.</p><p>Best regards,<br/>Visium Technologies Team</p>",
    textTemplate: "Deal Status Update\n\nHi {{partnerName}},\n\nWe wanted to inform you that the following deal has been closed:\n\nDeal Name: {{dealName}}\nCustomer: {{customerName}}\nDeal Amount: ${{dealAmount}}\nStatus: {{dealStage}}\n\nWe appreciate your effort on this opportunity. Please don't hesitate to reach out if you have any questions or if there are other opportunities we can explore together.\n\nBest regards,\nVisium Technologies Team",
    variables: ["partnerName", "dealName", "customerName", "dealAmount", "dealStage"],
  },

  mdf_submitted: {
    name: "MDF Claim Submitted",
    description: "Sent when a partner submits an MDF claim",
    subject: "MDF Claim Submitted: {{claimName}}",
    htmlTemplate: "<h2>MDF Claim Submitted</h2><p>Hi {{partnerName}},</p><p>Thank you for submitting your Marketing Development Fund (MDF) claim:</p><ul><li><strong>Claim Name:</strong> {{claimName}}</li><li><strong>Campaign Type:</strong> {{campaignType}}</li><li><strong>Requested Amount:</strong> ${{requestedAmount}}</li></ul><p>Our team will review your claim and notify you of the approval status within 5 business days.</p><p>Best regards,<br/>Visium Technologies Team</p>",
    textTemplate: "MDF Claim Submitted\n\nHi {{partnerName}},\n\nThank you for submitting your Marketing Development Fund (MDF) claim:\n\nClaim Name: {{claimName}}\nCampaign Type: {{campaignType}}\nRequested Amount: ${{requestedAmount}}\n\nOur team will review your claim and notify you of the approval status within 5 business days.\n\nBest regards,\nVisium Technologies Team",
    variables: ["partnerName", "claimName", "campaignType", "requestedAmount"],
  },

  mdf_approved: {
    name: "MDF Claim Approved",
    description: "Sent when an MDF claim is approved",
    subject: "MDF Claim Approved: {{claimName}}",
    htmlTemplate: "<h2>MDF Claim Approved</h2><p>Hi {{partnerName}},</p><p>Great news! Your MDF claim has been approved:</p><ul><li><strong>Claim Name:</strong> {{claimName}}</li><li><strong>Campaign Type:</strong> {{campaignType}}</li><li><strong>Requested Amount:</strong> ${{requestedAmount}}</li><li><strong>Approved Amount:</strong> ${{approvedAmount}}</li></ul><p>{{approvalNotes}}</p><p>The approved funds will be processed according to our standard payment terms. Thank you for your partnership!</p><p>Best regards,<br/>Visium Technologies Team</p>",
    textTemplate: "MDF Claim Approved\n\nHi {{partnerName}},\n\nGreat news! Your MDF claim has been approved:\n\nClaim Name: {{claimName}}\nCampaign Type: {{campaignType}}\nRequested Amount: ${{requestedAmount}}\nApproved Amount: ${{approvedAmount}}\n\n{{approvalNotes}}\n\nThe approved funds will be processed according to our standard payment terms. Thank you for your partnership!\n\nBest regards,\nVisium Technologies Team",
    variables: ["partnerName", "claimName", "campaignType", "requestedAmount", "approvedAmount", "approvalNotes"],
  },

  mdf_rejected: {
    name: "MDF Claim Rejected",
    description: "Sent when an MDF claim is rejected",
    subject: "MDF Claim Status Update: {{claimName}}",
    htmlTemplate: "<h2>MDF Claim Status Update</h2><p>Hi {{partnerName}},</p><p>We have reviewed your MDF claim and unfortunately it was not approved at this time:</p><ul><li><strong>Claim Name:</strong> {{claimName}}</li><li><strong>Campaign Type:</strong> {{campaignType}}</li><li><strong>Requested Amount:</strong> ${{requestedAmount}}</li></ul><p><strong>Reason:</strong> {{rejectionReason}}</p><p>Please feel free to reach out to discuss this decision or to submit a revised claim. We value your partnership!</p><p>Best regards,<br/>Visium Technologies Team</p>",
    textTemplate: "MDF Claim Status Update\n\nHi {{partnerName}},\n\nWe have reviewed your MDF claim and unfortunately it was not approved at this time:\n\nClaim Name: {{claimName}}\nCampaign Type: {{campaignType}}\nRequested Amount: ${{requestedAmount}}\n\nReason: {{rejectionReason}}\n\nPlease feel free to reach out to discuss this decision or to submit a revised claim. We value your partnership!\n\nBest regards,\nVisium Technologies Team",
    variables: ["partnerName", "claimName", "campaignType", "requestedAmount", "rejectionReason"],
  },

  mdf_paid: {
    name: "MDF Claim Paid",
    description: "Sent when an MDF claim payment is processed",
    subject: "MDF Claim Payment Processed: {{claimName}}",
    htmlTemplate: "<h2>MDF Claim Payment Processed</h2><p>Hi {{partnerName}},</p><p>Your MDF claim payment has been processed:</p><ul><li><strong>Claim Name:</strong> {{claimName}}</li><li><strong>Approved Amount:</strong> ${{approvedAmount}}</li><li><strong>Payment Status:</strong> Completed</li></ul><p>The funds should appear in your account within 3-5 business days. Thank you for your continued partnership!</p><p>Best regards,<br/>Visium Technologies Team</p>",
    textTemplate: "MDF Claim Payment Processed\n\nHi {{partnerName}},\n\nYour MDF claim payment has been processed:\n\nClaim Name: {{claimName}}\nApproved Amount: ${{approvedAmount}}\nPayment Status: Completed\n\nThe funds should appear in your account within 3-5 business days. Thank you for your continued partnership!\n\nBest regards,\nVisium Technologies Team",
    variables: ["partnerName", "claimName", "approvedAmount"],
  },
};
