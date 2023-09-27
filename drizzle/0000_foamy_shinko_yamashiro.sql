CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`username` text(50) NOT NULL,
	`credits` integer DEFAULT 3
);
