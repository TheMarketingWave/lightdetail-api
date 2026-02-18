CREATE TABLE `content` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`value` text,
	`type` text NOT NULL,
	`parent_id` integer,
	`order` integer DEFAULT 0,
	`metadata` text,
	`createdAt` integer,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE INDEX `content_parentId_idx` ON `content` (`parent_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `content_key_idx` ON `content` (`key`);