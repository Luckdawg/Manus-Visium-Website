CREATE TABLE `partner_contacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`partnerCompanyId` int NOT NULL,
	`contactName` varchar(255) NOT NULL,
	`contactTitle` varchar(100),
	`contactEmail` varchar(320) NOT NULL,
	`contactPhone` varchar(50),
	`contactType` enum('Account Executive','Sales Manager','Technical Lead','Finance Contact','Other') NOT NULL,
	`isPrimary` boolean DEFAULT false,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `partner_contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `partner_deal_documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dealId` int NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileUrl` varchar(512) NOT NULL,
	`fileSize` int NOT NULL,
	`fileMimeType` varchar(100) NOT NULL,
	`documentType` enum('Proposal','Contract','Technical Specifications','Implementation Plan','Pricing Quote','Customer Reference','Compliance Document','Other') NOT NULL,
	`uploadedBy` int NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `partner_deal_documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `partner_deal_qualifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dealId` int NOT NULL,
	`budgetConfirmed` boolean DEFAULT false,
	`decisionMakerIdentified` boolean DEFAULT false,
	`competitiveLandscapeAnalyzed` boolean DEFAULT false,
	`competitiveLandscapeDetails` text,
	`qualificationNotes` text,
	`qualificationScore` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `partner_deal_qualifications_id` PRIMARY KEY(`id`),
	CONSTRAINT `partner_deal_qualifications_dealId_unique` UNIQUE(`dealId`)
);
--> statement-breakpoint
CREATE INDEX `partner_idx` ON `partner_contacts` (`partnerCompanyId`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `partner_contacts` (`contactEmail`);--> statement-breakpoint
CREATE INDEX `deal_idx` ON `partner_deal_documents` (`dealId`);--> statement-breakpoint
CREATE INDEX `type_idx` ON `partner_deal_documents` (`documentType`);--> statement-breakpoint
CREATE INDEX `deal_idx` ON `partner_deal_qualifications` (`dealId`);