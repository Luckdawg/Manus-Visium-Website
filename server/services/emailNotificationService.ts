import { notifyOwner } from "../_core/notification";
import { getDb } from "../db";
import {
  emailNotifications,
  emailTemplates,
  partnerNotificationPreferences,
  partnerCompanies,
  partnerUsers,
} from "../../drizzle/partner-schema";
import { eq, and } from "drizzle-orm";

/**
 * Email template variables for rendering
 */
export interface EmailTemplateVars {
  partnerName?: string;
  dealName?: string;
  dealAmount?: string;
  dealStage?: string;
  customerName?: string;
  commissionAmount?: string;
  claimName?: string;
  campaignType?: string;
  requestedAmount?: string;
  approvedAmount?: string;
  rejectionReason?: string;
  approvalNotes?: string;
  [key: string]: any;
}

/**
 * Email notification types
 */
export type NotificationType =
  | "deal_submitted"
  | "deal_qualified"
  | "deal_proposal"
  | "deal_negotiation"
  | "deal_won"
  | "deal_lost"
  | "mdf_submitted"
  | "mdf_approved"
  | "mdf_rejected"
  | "mdf_paid";

/**
 * Email notification service for managing partner communications
 */
export class EmailNotificationService {
  /**
   * Render email template with variables
   */
  static renderTemplate(template: string, vars: EmailTemplateVars): string {
    let rendered = template;

    // Replace all variables in format {{variableName}}
    Object.entries(vars).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      rendered = rendered.replace(regex, String(value || ""));
    });

    return rendered;
  }

  /**
   * Get email template by type
   */
  static async getTemplate(templateType: NotificationType) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const template = await db
      .select()
      .from(emailTemplates)
      .where(and(eq(emailTemplates.templateType, templateType), eq(emailTemplates.isActive, true)))
      .limit(1);

    return template[0] || null;
  }

  /**
   * Get partner notification preferences
   */
  static async getNotificationPreferences(partnerCompanyId: number) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const prefs = await db
      .select()
      .from(partnerNotificationPreferences)
      .where(eq(partnerNotificationPreferences.partnerCompanyId, partnerCompanyId))
      .limit(1);

    return prefs[0] || null;
  }

  /**
   * Get recipient emails for a partner
   */
  static async getRecipientEmails(partnerCompanyId: number): Promise<string[]> {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Get notification preferences
    const prefs = await this.getNotificationPreferences(partnerCompanyId);

    if (prefs && prefs.notificationEmails) {
      try {
        const emails = JSON.parse(prefs.notificationEmails);
        return Array.isArray(emails) ? emails : [prefs.notificationEmails];
      } catch {
        return [prefs.notificationEmails];
      }
    }

    // Fallback: get primary contact email from partner company
    const company = await db
      .select()
      .from(partnerCompanies)
      .where(eq(partnerCompanies.id, partnerCompanyId))
      .limit(1);

    return company[0] ? [company[0].primaryContactEmail] : [];
  }

  /**
   * Check if notification type is enabled for partner
   */
  static async isNotificationEnabled(
    partnerCompanyId: number,
    notificationType: NotificationType
  ): Promise<boolean> {
    const prefs = await this.getNotificationPreferences(partnerCompanyId);

    if (!prefs) return true; // Default to enabled if no preferences

    const enabledMap: Record<NotificationType, boolean | null> = {
      deal_submitted: prefs.notifyOnDealSubmitted,
      deal_qualified: prefs.notifyOnDealQualified,
      deal_proposal: prefs.notifyOnDealProposal,
      deal_negotiation: prefs.notifyOnDealNegotiation,
      deal_won: prefs.notifyOnDealWon,
      deal_lost: prefs.notifyOnDealLost,
      mdf_submitted: prefs.notifyOnMdfSubmitted,
      mdf_approved: prefs.notifyOnMdfApproved,
      mdf_rejected: prefs.notifyOnMdfRejected,
      mdf_paid: prefs.notifyOnMdfPaid,
    };

    return (enabledMap[notificationType] ?? true) as boolean;
  }

  /**
   * Send email notification
   */
  static async sendNotification(
    partnerCompanyId: number,
    notificationType: NotificationType,
    templateVars: EmailTemplateVars,
    relatedEntityType: "deal" | "mdf_claim" | "other" = "other",
    relatedEntityId?: number
  ): Promise<boolean> {
    try {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check if notification is enabled
      const isEnabled = await this.isNotificationEnabled(partnerCompanyId, notificationType);
      if (!isEnabled) {
        console.log(`Notification ${notificationType} disabled for partner ${partnerCompanyId}`);
        return true;
      }

      // Get email template
      const template = await this.getTemplate(notificationType);
      if (!template) {
        console.error(`Email template not found for type: ${notificationType}`);
        return false;
      }

      // Get recipient emails
      const recipientEmails = await this.getRecipientEmails(partnerCompanyId);
      if (recipientEmails.length === 0) {
        console.error(`No recipient emails found for partner ${partnerCompanyId}`);
        return false;
      }

      // Render template
      const subject = this.renderTemplate(template.subject, templateVars);
      const htmlContent = this.renderTemplate(template.htmlTemplate, templateVars);
      const textContent = template.textTemplate
        ? this.renderTemplate(template.textTemplate, templateVars)
        : "";

      // Send to each recipient
      let successCount = 0;
      for (const email of recipientEmails) {
        try {
          // Store notification record
          await db.insert(emailNotifications).values({
            recipientEmail: email,
            recipientName: templateVars.partnerName || "",
            partnerCompanyId,
            subject,
            templateType: notificationType,
            htmlContent,
            textContent,
            relatedEntityType,
            relatedEntityId,
            status: "pending",
            metadata: JSON.stringify({
              templateVars,
              sentAt: new Date().toISOString(),
            }),
          });

          // Use built-in notification system to send email
          const result = await notifyOwner({
            title: subject,
            content: htmlContent,
          });

          if (result) {
            // Update notification status to sent
            await db
              .update(emailNotifications)
              .set({ status: "sent", sentAt: new Date() })
              .where(
                and(
                  eq(emailNotifications.recipientEmail, email),
                  eq(emailNotifications.templateType, notificationType)
                )
              );

            successCount++;
          }
        } catch (error) {
          console.error(`Failed to send email to ${email}:`, error);
          // Update notification status to failed
          await db
            .update(emailNotifications)
            .set({
              status: "failed",
              failureReason: String(error),
              retryCount: 1,
            })
            .where(
              and(
                eq(emailNotifications.recipientEmail, email),
                eq(emailNotifications.templateType, notificationType)
              )
            );
        }
      }

      return successCount > 0;
    } catch (error) {
      console.error("Error in sendNotification:", error);
      return false;
    }
  }

  /**
   * Retry failed notifications
   */
  static async retryFailedNotifications(): Promise<number> {
    try {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get failed notifications that haven't exceeded max retries
      const failedNotifications = await db
        .select()
        .from(emailNotifications)
        .where(
          and(
            eq(emailNotifications.status, "failed"),
            // retryCount < maxRetries - this is a simplified check
          )
        );

      let successCount = 0;

      for (const notification of failedNotifications) {
        const notifRetryCount = notification.retryCount || 0;
        const maxRetries = notification.maxRetries || 3;

        if (notifRetryCount >= maxRetries) {
          continue;
        }

        try {
          // Resend the notification
          const result = await notifyOwner({
            title: notification.subject,
            content: notification.htmlContent,
          });

          if (result) {
            await db
              .update(emailNotifications)
              .set({
                status: "sent",
                sentAt: new Date(),
                retryCount: notifRetryCount + 1,
              })
              .where(eq(emailNotifications.id, notification.id));

            successCount++;
          } else {
            await db
              .update(emailNotifications)
              .set({
                retryCount: notifRetryCount + 1,
              })
              .where(eq(emailNotifications.id, notification.id));
          }
        } catch (error) {
          console.error(`Failed to retry notification ${notification.id}:`, error);
        }
      }

      return successCount;
    } catch (error) {
      console.error("Error in retryFailedNotifications:", error);
      return 0;
    }
  }

  /**
   * Get notification history for a partner
   */
  static async getNotificationHistory(
    partnerCompanyId: number,
    limit: number = 50,
    offset: number = 0
  ) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    return await db
      .select()
      .from(emailNotifications)
      .where(eq(emailNotifications.partnerCompanyId, partnerCompanyId))
      .orderBy((table) => table.createdAt)
      .limit(limit)
      .offset(offset);
  }
}
