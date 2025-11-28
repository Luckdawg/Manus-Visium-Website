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
