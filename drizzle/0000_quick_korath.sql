CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`team_id` text NOT NULL,
	`stripe_session_id` text NOT NULL,
	`mpc_order_id` text,
	`status` text DEFAULT 'pending_payment' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `players` (
	`id` text PRIMARY KEY NOT NULL,
	`team_id` text NOT NULL,
	`name` text NOT NULL,
	`jersey_number` text NOT NULL,
	`position` text NOT NULL,
	`raw_image_url` text,
	`clean_image_url` text,
	`proof_image_url` text,
	`print_image_url` text,
	`status` text DEFAULT 'empty' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`team_name` text NOT NULL,
	`sport` text NOT NULL,
	`roster_size` integer NOT NULL,
	`payment_status` text DEFAULT 'unpaid' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`stripe_customer_id` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);