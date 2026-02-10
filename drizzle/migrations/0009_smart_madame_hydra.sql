CREATE TABLE `partner_password_reset_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`email` varchar(320) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`usedAt` timestamp,
	`isUsed` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `partner_password_reset_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `partner_password_reset_tokens_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE INDEX `user_idx` ON `partner_password_reset_tokens` (`userId`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `partner_password_reset_tokens` (`email`);--> statement-breakpoint
CREATE INDEX `token_idx` ON `partner_password_reset_tokens` (`token`);--> statement-breakpoint
CREATE INDEX `expires_idx` ON `partner_password_reset_tokens` (`expiresAt`);