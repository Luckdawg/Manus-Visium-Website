CREATE TABLE `blog_leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` varchar(320) NOT NULL,
	`company` text NOT NULL,
	`blogTitle` varchar(500) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blog_leads_id` PRIMARY KEY(`id`)
);
