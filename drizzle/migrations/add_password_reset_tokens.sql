CREATE TABLE `partner_password_reset_tokens` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `email` varchar(320) NOT NULL,
  `token` varchar(255) NOT NULL UNIQUE,
  `expiresAt` timestamp NOT NULL,
  `usedAt` timestamp,
  `isUsed` boolean NOT NULL DEFAULT false,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_idx` (`userId`),
  KEY `email_idx` (`email`),
  KEY `token_idx` (`token`),
  KEY `expires_idx` (`expiresAt`)
);
