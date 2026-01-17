PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`type` text NOT NULL,
	`coverImageUrl` text,
	`description` text,
	`latestPosition` integer,
	`tags` text DEFAULT '[]' NOT NULL,
	`imgs` text DEFAULT '[]' NOT NULL,
	`updatedAt` integer,
	`createdAt` integer,
	`order` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_projects`("id", "title", "type", "coverImageUrl", "description", "latestPosition", "updatedAt", "createdAt") SELECT "id", "title", "type", "coverImageUrl", "description", "latestPosition", "updatedAt", "createdAt" FROM `projects`;--> statement-breakpoint
DROP TABLE `projects`;--> statement-breakpoint
ALTER TABLE `__new_projects` RENAME TO `projects`;--> statement-breakpoint
PRAGMA foreign_keys=ON;