CREATE TABLE `bans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`reason` text NOT NULL,
	`bannedBy` int NOT NULL,
	`banType` enum('temporary','permanent') NOT NULL,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`contentId` int NOT NULL,
	`contentType` varchar(20) NOT NULL,
	`text` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `communityMix` (
	`id` int AUTO_INCREMENT NOT NULL,
	`creatorId` int NOT NULL,
	`type` enum('vhs','cassette','board') NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` text,
	`url` text,
	`coverImage` text,
	`tracks` text,
	`metadata` text,
	`votes` int NOT NULL DEFAULT 0,
	`views` int NOT NULL DEFAULT 0,
	`isInstantDrop` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `communityMix_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`category` enum('boombox','vhs','cassette','background','beatbunny') NOT NULL,
	`previewImage` text NOT NULL,
	`cssData` text,
	`hakiRequired` int NOT NULL DEFAULT 0,
	`isExclusive` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `skins_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userDropQuota` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`vhsUsed` int NOT NULL DEFAULT 0,
	`cassetteUsed` int NOT NULL DEFAULT 0,
	`boardUsed` int NOT NULL DEFAULT 0,
	`vhsLimit` int NOT NULL DEFAULT 1,
	`cassetteLimit` int NOT NULL DEFAULT 1,
	`boardLimit` int NOT NULL DEFAULT 1,
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userDropQuota_id` PRIMARY KEY(`id`),
	CONSTRAINT `userDropQuota_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `userSkins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`skinId` int NOT NULL,
	`unlockedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userSkins_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `violations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` varchar(50) NOT NULL,
	`description` text,
	`severity` enum('warning','minor','major','critical') NOT NULL DEFAULT 'minor',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `violations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `votes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`contentId` int NOT NULL,
	`contentType` varchar(20) NOT NULL,
	`voteType` enum('upvote','downvote') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `votes_id` PRIMARY KEY(`id`)
);
