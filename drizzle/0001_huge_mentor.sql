CREATE TABLE `analyticsEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`eventType` varchar(50) NOT NULL,
	`eventData` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analyticsEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contactRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`reason` text NOT NULL,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`approvedBy` int,
	`contactMethod` varchar(200),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`reviewedAt` timestamp,
	CONSTRAINT `contactRequests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hakiEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`eventType` varchar(50) NOT NULL,
	`points` int NOT NULL,
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `hakiEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tapes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`creatorId` int NOT NULL,
	`type` enum('vhs','cassette') NOT NULL,
	`title` varchar(200) NOT NULL,
	`creator` varchar(100) NOT NULL,
	`color` varchar(20) NOT NULL,
	`tracks` text NOT NULL,
	`status` enum('draft','pending','approved','rejected') NOT NULL DEFAULT 'draft',
	`reviewedBy` int,
	`reviewNote` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`reviewedAt` timestamp,
	CONSTRAINT `tapes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `walletAddress` varchar(42);--> statement-breakpoint
ALTER TABLE `users` ADD `hakiScore` int DEFAULT 10 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `isInWaitlist` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `waitlistRoles` text;--> statement-breakpoint
ALTER TABLE `users` ADD `discordHandle` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `twitterHandle` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_walletAddress_unique` UNIQUE(`walletAddress`);