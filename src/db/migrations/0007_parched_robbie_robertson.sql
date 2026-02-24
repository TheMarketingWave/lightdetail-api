DROP INDEX `content_key_idx`;--> statement-breakpoint
CREATE UNIQUE INDEX `content_key_parent_idx` ON `content` (`key`,`parent_id`);