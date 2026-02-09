CREATE TABLE `audit_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`action` varchar(100) NOT NULL,
	`entityType` varchar(50),
	`entityId` int,
	`details` text,
	`ipAddress` varchar(45),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blog_leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` varchar(320) NOT NULL,
	`company` text NOT NULL,
	`blogTitle` varchar(500) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blog_leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cms_media` (
	`id` int AUTO_INCREMENT NOT NULL,
	`filename` varchar(255) NOT NULL,
	`originalName` varchar(255) NOT NULL,
	`mimeType` varchar(100) NOT NULL,
	`size` int NOT NULL,
	`url` varchar(500) NOT NULL,
	`s3Key` varchar(500) NOT NULL,
	`uploadedBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cms_media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cms_pages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pageKey` varchar(100) NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`lastEditedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cms_pages_id` PRIMARY KEY(`id`),
	CONSTRAINT `cms_pages_pageKey_unique` UNIQUE(`pageKey`)
);
--> statement-breakpoint
CREATE TABLE `email_campaigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`campaignStage` enum('day1','day3','day7') NOT NULL,
	`scheduledFor` timestamp NOT NULL,
	`sentAt` timestamp,
	`status` enum('pending','sent','failed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `email_campaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `newsletter_subscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` text,
	`subscribedTo` enum('investor_alerts','general_news','product_updates') NOT NULL DEFAULT 'investor_alerts',
	`status` enum('active','unsubscribed') NOT NULL DEFAULT 'active',
	`subscribedAt` timestamp NOT NULL DEFAULT (now()),
	`unsubscribedAt` timestamp,
	`verificationToken` varchar(64),
	`verified` int NOT NULL DEFAULT 0,
	CONSTRAINT `newsletter_subscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsletter_subscribers_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `partner_analytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`partnerCompanyId` int NOT NULL,
	`period` varchar(20) NOT NULL,
	`dealsSubmitted` int DEFAULT 0,
	`dealsWon` int DEFAULT 0,
	`dealsLost` int DEFAULT 0,
	`totalDealValue` decimal(15,2) DEFAULT '0.00',
	`totalCommissionEarned` decimal(15,2) DEFAULT '0.00',
	`totalCommissionPaid` decimal(15,2) DEFAULT '0.00',
	`resourceDownloads` int DEFAULT 0,
	`trainingCompletions` int DEFAULT 0,
	`supportTickets` int DEFAULT 0,
	`conversionRate` decimal(5,2) DEFAULT '0.00',
	`averageDealSize` decimal(15,2) DEFAULT '0.00',
	`salesVelocity` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `partner_analytics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `partner_companies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`website` varchar(255),
	`phone` varchar(50),
	`email` varchar(320) NOT NULL,
	`address` text,
	`city` varchar(100),
	`state` varchar(50),
	`country` varchar(100),
	`zipCode` varchar(20),
	`partnerType` enum('Reseller','Technology Partner','System Integrator','Managed Service Provider','Consulting Partner','Channel Partner','OEM Partner','Other') NOT NULL,
	`partnerStatus` enum('Prospect','Active','Inactive','Suspended','Terminated') NOT NULL DEFAULT 'Prospect',
	`tier` enum('Gold','Silver','Bronze','Standard') DEFAULT 'Standard',
	`primaryContactName` varchar(255) NOT NULL,
	`primaryContactEmail` varchar(320) NOT NULL,
	`primaryContactPhone` varchar(50),
	`commissionRate` decimal(5,2) DEFAULT '10.00',
	`mdfBudgetAnnual` decimal(15,2) DEFAULT '0.00',
	`description` text,
	`logoUrl` varchar(512),
	`certifications` text,
	`specializations` text,
	`accountManagerId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `partner_companies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `partner_deals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dealName` varchar(255) NOT NULL,
	`partnerCompanyId` int NOT NULL,
	`customerName` varchar(255) NOT NULL,
	`customerEmail` varchar(320),
	`customerPhone` varchar(50),
	`customerIndustry` varchar(100),
	`customerSize` enum('Startup','SMB','Mid-Market','Enterprise','Government'),
	`dealAmount` decimal(15,2) NOT NULL,
	`dealStage` enum('Qualified Lead','Proposal','Negotiation','Closed Won','Closed Lost') NOT NULL DEFAULT 'Qualified Lead',
	`expectedCloseDate` timestamp,
	`closedDate` timestamp,
	`productInterest` text,
	`description` text,
	`commissionPercentage` decimal(5,2),
	`commissionAmount` decimal(15,2),
	`commissionPaid` boolean DEFAULT false,
	`commissionPaidDate` timestamp,
	`submittedBy` int NOT NULL,
	`internalOwner` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `partner_deals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `partner_mdf_claims` (
	`id` int AUTO_INCREMENT NOT NULL,
	`partnerCompanyId` int NOT NULL,
	`claimName` varchar(255) NOT NULL,
	`description` text,
	`campaignType` enum('Digital Marketing','Event Sponsorship','Content Creation','Sales Enablement','Training','Co-Marketing','Other') NOT NULL,
	`requestedAmount` decimal(15,2) NOT NULL,
	`approvedAmount` decimal(15,2),
	`paidAmount` decimal(15,2) DEFAULT '0.00',
	`status` enum('Draft','Submitted','Under Review','Approved','Rejected','Paid','Archived') NOT NULL DEFAULT 'Draft',
	`submittedDate` timestamp,
	`approvedDate` timestamp,
	`paidDate` timestamp,
	`attachmentUrl` varchar(512),
	`approvalNotes` text,
	`submittedBy` int NOT NULL,
	`approvedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `partner_mdf_claims_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `partner_resources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`resourceName` varchar(255) NOT NULL,
	`resourceType` enum('Training Video','Sales Collateral','Technical Documentation','Case Study','Presentation','Whitepaper','Demo','Tool','Other') NOT NULL,
	`description` text,
	`fileUrl` varchar(512) NOT NULL,
	`fileSize` int,
	`accessLevel` enum('Public','Partner','Premium Partner','Internal Only') NOT NULL DEFAULT 'Partner',
	`partnerTierRequired` enum('Standard','Bronze','Silver','Gold') DEFAULT 'Standard',
	`category` varchar(100),
	`tags` text,
	`downloadCount` int DEFAULT 0,
	`lastUpdated` timestamp,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `partner_resources_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `partner_users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`partnerCompanyId` int NOT NULL,
	`partnerRole` enum('Admin','Account Manager','Sales Rep','Technical','Finance','Support','Other') NOT NULL DEFAULT 'Sales Rep',
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `partner_users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sec_filings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`filingType` varchar(20) NOT NULL,
	`filingDate` timestamp NOT NULL,
	`accessionNumber` varchar(50) NOT NULL,
	`fileNumber` varchar(20),
	`description` text,
	`documentUrl` text,
	`size` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sec_filings_id` PRIMARY KEY(`id`),
	CONSTRAINT `sec_filings_accessionNumber_unique` UNIQUE(`accessionNumber`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin','super_admin','editor','viewer','partner') NOT NULL DEFAULT 'user',
	`password` varchar(255),
	`twoFactorSecret` varchar(64),
	`twoFactorEnabled` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE TABLE `whitepaper_leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` varchar(320) NOT NULL,
	`company` text NOT NULL,
	`resource` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `whitepaper_leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `partner_idx` ON `partner_analytics` (`partnerCompanyId`);--> statement-breakpoint
CREATE INDEX `period_idx` ON `partner_analytics` (`period`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `partner_companies` (`partnerStatus`);--> statement-breakpoint
CREATE INDEX `type_idx` ON `partner_companies` (`partnerType`);--> statement-breakpoint
CREATE INDEX `manager_idx` ON `partner_companies` (`accountManagerId`);--> statement-breakpoint
CREATE INDEX `partner_idx` ON `partner_deals` (`partnerCompanyId`);--> statement-breakpoint
CREATE INDEX `stage_idx` ON `partner_deals` (`dealStage`);--> statement-breakpoint
CREATE INDEX `submitted_idx` ON `partner_deals` (`submittedBy`);--> statement-breakpoint
CREATE INDEX `partner_idx` ON `partner_mdf_claims` (`partnerCompanyId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `partner_mdf_claims` (`status`);--> statement-breakpoint
CREATE INDEX `submitted_idx` ON `partner_mdf_claims` (`submittedBy`);--> statement-breakpoint
CREATE INDEX `type_idx` ON `partner_resources` (`resourceType`);--> statement-breakpoint
CREATE INDEX `access_idx` ON `partner_resources` (`accessLevel`);--> statement-breakpoint
CREATE INDEX `category_idx` ON `partner_resources` (`category`);--> statement-breakpoint
CREATE INDEX `partner_idx` ON `partner_users` (`partnerCompanyId`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `partner_users` (`userId`);