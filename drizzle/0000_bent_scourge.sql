CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
CREATE TABLE `entries` (
	`id` text PRIMARY KEY NOT NULL,
	`category_id` text NOT NULL,
	`name` text NOT NULL,
	`company` text DEFAULT '' NOT NULL,
	`slug` text NOT NULL,
	`image_url` text,
	`source_url` text DEFAULT '' NOT NULL,
	`website_url` text DEFAULT '' NOT NULL,
	`elo_rating` real DEFAULT 1500 NOT NULL,
	`wins` integer DEFAULT 0 NOT NULL,
	`losses` integer DEFAULT 0 NOT NULL,
	`total_votes` integer DEFAULT 0 NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`submission_status` text DEFAULT 'approved' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `entries_slug_unique` ON `entries` (`slug`);--> statement-breakpoint
CREATE INDEX `entries_pool` ON `entries` (`category_id`,`active`,`submission_status`);--> statement-breakpoint
CREATE TABLE `matchups` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`category_id` text NOT NULL,
	`left_id` text NOT NULL,
	`right_id` text NOT NULL,
	`used` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`left_id`) REFERENCES `entries`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`right_id`) REFERENCES `entries`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `matchups_session_recent` ON `matchups` (`session_id`,`category_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `removal_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`entry_id` text,
	`item_url` text NOT NULL,
	`reason` text NOT NULL,
	`email` text NOT NULL,
	`additional_information` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`session_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`entry_id`) REFERENCES `entries`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `removal_session_recent` ON `removal_requests` (`session_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`last_vote_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`name` text NOT NULL,
	`company` text DEFAULT '' NOT NULL,
	`website_url` text DEFAULT '' NOT NULL,
	`source_url` text DEFAULT '' NOT NULL,
	`image_url` text,
	`email` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`session_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`category`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `submissions_session_recent` ON `submissions` (`session_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `votes` (
	`id` text PRIMARY KEY NOT NULL,
	`category_id` text NOT NULL,
	`winner_id` text NOT NULL,
	`loser_id` text NOT NULL,
	`session_id` text NOT NULL,
	`matchup_id` text NOT NULL,
	`winner_before` real NOT NULL,
	`loser_before` real NOT NULL,
	`winner_after` real NOT NULL,
	`loser_after` real NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`winner_id`) REFERENCES `entries`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`loser_id`) REFERENCES `entries`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`matchup_id`) REFERENCES `matchups`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `votes_matchup_id_unique` ON `votes` (`matchup_id`);--> statement-breakpoint
CREATE INDEX `votes_session_recent` ON `votes` (`session_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `votes_category_recent` ON `votes` (`category_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `votes_winner` ON `votes` (`winner_id`);--> statement-breakpoint
CREATE INDEX `votes_loser` ON `votes` (`loser_id`);