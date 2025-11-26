CREATE TABLE `whitepaper_leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` varchar(320) NOT NULL,
	`company` text NOT NULL,
	`resource` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `whitepaper_leads_id` PRIMARY KEY(`id`)
);
