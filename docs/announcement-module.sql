CREATE TABLE `announcements` (
  `announcement_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `announcement_uuid` CHAR(36) NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `event_type` VARCHAR(50) NOT NULL,
  `organizer` VARCHAR(255) DEFAULT NULL,
  `venue` VARCHAR(255) NOT NULL,
  `starts_at` DATETIME NOT NULL,
  `ends_at` DATETIME DEFAULT NULL,
  `description` TEXT NOT NULL,
  `registration_link` VARCHAR(1024) DEFAULT NULL,
  `privacy` ENUM('public', 'friends', 'only_me') NOT NULL DEFAULT 'public',
  `status` VARCHAR(50) NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`announcement_id`),
  UNIQUE KEY `announcements_announcement_uuid_unique` (`announcement_uuid`),
  KEY `announcements_status_starts_at_index` (`status`, `starts_at`),
  KEY `announcements_user_id_foreign` (`user_id`),
  CONSTRAINT `announcements_user_id_foreign`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `announcement_attachments` (
  `announcement_attachment_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `announcement_id` BIGINT UNSIGNED NOT NULL,
  `url` VARCHAR(1024) NOT NULL,
  `type` ENUM('image', 'video', 'file') NOT NULL DEFAULT 'image',
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`announcement_attachment_id`),
  KEY `announcement_attachments_announcement_id_foreign` (`announcement_id`),
  CONSTRAINT `announcement_attachments_announcement_id_foreign`
    FOREIGN KEY (`announcement_id`) REFERENCES `announcements` (`announcement_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
