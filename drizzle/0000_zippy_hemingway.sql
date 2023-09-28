CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`username` text(50),
	`first_name` text(255),
	`last_name` text(255),
	`credits` integer DEFAULT 3
);
