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
