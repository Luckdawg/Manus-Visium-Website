CREATE TABLE `email_notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recipientEmail` varchar(320) NOT NULL,
	`recipientName` varchar(255),
	`partnerCompanyId` int NOT NULL,
	`subject` varchar(255) NOT NULL,
	`templateType` enum('deal_submitted','deal_qualified','deal_proposal','deal_negotiation','deal_won','deal_lost','mdf_submitted','mdf_approved','mdf_rejected','mdf_paid','custom') NOT NULL,
	`htmlContent` text NOT NULL,
	`textContent` text,
	`relatedEntityType` enum('deal','mdf_claim','other') NOT NULL,
	`relatedEntityId` int,
	`status` enum('pending','sent','failed','bounced','opened','clicked') NOT NULL DEFAULT 'pending',
	`sentAt` timestamp,
	`failureReason` text,
	`retryCount` int DEFAULT 0,
	`maxRetries` int DEFAULT 3,
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `email_notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `email_templates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`templateType` enum('deal_submitted','deal_qualified','deal_proposal','deal_negotiation','deal_won','deal_lost','mdf_submitted','mdf_approved','mdf_rejected','mdf_paid','custom') NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`subject` varchar(255) NOT NULL,
	`htmlTemplate` text NOT NULL,
	`textTemplate` text,
	`variables` text,
	`isActive` boolean DEFAULT true,
	`isDefault` boolean DEFAULT false,
	`createdBy` int NOT NULL,
	`updatedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `email_templates_id` PRIMARY KEY(`id`),
	CONSTRAINT `email_templates_templateType_unique` UNIQUE(`templateType`)
);
--> statement-breakpoint
CREATE TABLE `partner_notification_preferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`partnerCompanyId` int NOT NULL,
	`notifyOnDealSubmitted` boolean DEFAULT true,
	`notifyOnDealQualified` boolean DEFAULT true,
	`notifyOnDealProposal` boolean DEFAULT true,
	`notifyOnDealNegotiation` boolean DEFAULT true,
	`notifyOnDealWon` boolean DEFAULT true,
	`notifyOnDealLost` boolean DEFAULT true,
	`notifyOnMdfSubmitted` boolean DEFAULT true,
	`notifyOnMdfApproved` boolean DEFAULT true,
	`notifyOnMdfRejected` boolean DEFAULT true,
	`notifyOnMdfPaid` boolean DEFAULT true,
	`emailFrequency` enum('immediate','daily_digest','weekly_digest','never') NOT NULL DEFAULT 'immediate',
	`notificationEmails` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `partner_notification_preferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `partner_notification_preferences_partnerCompanyId_unique` UNIQUE(`partnerCompanyId`)
);
--> statement-breakpoint
CREATE INDEX `email_idx` ON `email_notifications` (`recipientEmail`);--> statement-breakpoint
CREATE INDEX `partner_idx` ON `email_notifications` (`partnerCompanyId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `email_notifications` (`status`);--> statement-breakpoint
CREATE INDEX `template_idx` ON `email_notifications` (`templateType`);--> statement-breakpoint
CREATE INDEX `entity_idx` ON `email_notifications` (`relatedEntityId`);--> statement-breakpoint
CREATE INDEX `type_idx` ON `email_templates` (`templateType`);--> statement-breakpoint
CREATE INDEX `active_idx` ON `email_templates` (`isActive`);--> statement-breakpoint
CREATE INDEX `partner_idx` ON `partner_notification_preferences` (`partnerCompanyId`);