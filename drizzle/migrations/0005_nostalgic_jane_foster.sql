ALTER TABLE `partner_users` MODIFY COLUMN `userId` int;--> statement-breakpoint
ALTER TABLE `partner_users` ADD `email` varchar(320);--> statement-breakpoint
ALTER TABLE `partner_users` ADD `passwordHash` varchar(255);--> statement-breakpoint
ALTER TABLE `partner_users` ADD `emailVerified` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `partner_users` ADD `contactName` varchar(255);--> statement-breakpoint
ALTER TABLE `partner_users` ADD `phone` varchar(50);--> statement-breakpoint
ALTER TABLE `partner_users` ADD CONSTRAINT `partner_users_email_unique` UNIQUE(`email`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `partner_users` (`email`);