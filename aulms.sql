-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 27, 2026 at 08:19 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `aulms`
--

-- --------------------------------------------------------

--
-- Table structure for table `branches`
--

CREATE TABLE `branches` (
  `branch_id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` varchar(500) NOT NULL,
  `contact` varchar(500) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `branches`
--

INSERT INTO `branches` (`branch_id`, `name`, `address`, `contact`, `created_at`, `updated_at`) VALUES
(1, 'Andres Bonifacio Campus', 'Pasig City', '02-1234-5678', '2026-04-08 09:35:04', '2026-04-08 09:35:04'),
(2, 'Legarda Campus', 'Manila City', '02-9876-5432', '2026-04-08 09:35:04', '2026-04-08 09:35:04');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `course_id` int(10) UNSIGNED NOT NULL,
  `branch_id` int(10) UNSIGNED NOT NULL,
  `department_id` int(10) UNSIGNED NOT NULL,
  `name` varchar(200) NOT NULL,
  `code` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`course_id`, `branch_id`, `department_id`, `name`, `code`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Bachelor of Science in Computer Science', 'BSCS', '2026-04-08 09:35:04', '2026-04-08 09:35:04'),
(2, 1, 2, 'Bachelor of Science in Business Administration', 'BSBA', '2026-04-08 09:35:04', '2026-04-08 09:35:04'),
(3, 2, 3, 'Bachelor of Science in Civil Engineering', 'BSCE', '2026-04-08 09:35:04', '2026-04-08 09:35:04');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `department_id` int(10) UNSIGNED NOT NULL,
  `branch_id` int(10) UNSIGNED NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`department_id`, `branch_id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 1, 'Computer Studies', 'CS/IT department offering undergraduate and graduate programs', '2026-04-08 09:35:04', '2026-04-08 09:35:04'),
(2, 1, 'Business Administration', 'Business and management programs', '2026-04-08 09:35:04', '2026-04-08 09:35:04'),
(3, 2, 'Engineering', 'Engineering programs at downtown campus', '2026-04-08 09:35:04', '2026-04-08 09:35:04');

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

CREATE TABLE `enrollments` (
  `enrollment_id` int(10) UNSIGNED NOT NULL,
  `section_id` int(10) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'enrolled',
  `enrolled_at` varchar(50) DEFAULT NULL,
  `dropped_at` varchar(50) DEFAULT NULL,
  `final_grade` decimal(5,2) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `enrollments`
--

INSERT INTO `enrollments` (`enrollment_id`, `section_id`, `student_id`, `status`, `enrolled_at`, `dropped_at`, `final_grade`, `remarks`, `created_at`, `updated_at`) VALUES
(15, 2, 6, 'enrolled', '2026-04-26', NULL, NULL, NULL, '2026-04-26 02:49:33', '2026-04-26 02:49:33'),
(16, 2, 1, 'enrolled', '2026-04-26', NULL, NULL, NULL, '2026-04-26 02:50:43', '2026-04-26 02:50:43');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `instructors`
--

CREATE TABLE `instructors` (
  `instructor_id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `branch_id` int(10) UNSIGNED NOT NULL,
  `department_id` int(10) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `instructors`
--

INSERT INTO `instructors` (`instructor_id`, `first_name`, `last_name`, `email`, `branch_id`, `department_id`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 'Alice', 'Santos', 'alice.santos@example.com', 1, 1, 2, '2026-04-08 09:35:04', '2026-04-08 09:35:04'),
(2, 'Ben', 'Cruz', 'ben.cruz@example.com', 1, 1, 3, '2026-04-08 09:35:04', '2026-04-08 09:35:04'),
(3, 'Carla', 'Reyes', 'carla.reyes@example.com', 1, 1, 4, '2026-04-08 09:35:04', '2026-04-08 09:35:04');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lessons`
--

CREATE TABLE `lessons` (
  `lesson_id` int(10) UNSIGNED NOT NULL,
  `section_id` int(10) UNSIGNED NOT NULL,
  `subject_id` int(10) UNSIGNED NOT NULL,
  `instructor_id` bigint(20) UNSIGNED NOT NULL,
  `module` varchar(255) DEFAULT NULL,
  `lesson_no` int(10) UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lessons`
--

INSERT INTO `lessons` (`lesson_id`, `section_id`, `subject_id`, `instructor_id`, `module`, `lesson_no`, `title`, `description`, `published_at`, `created_at`, `updated_at`) VALUES
(1, 1, 3, 1, 'Module 1', 1, 'Introduction to the Course', 'Overview of the subject and expectations.', '2026-04-26 13:31:27', '2026-04-26 13:31:27', '2026-04-26 13:31:27'),
(2, 1, 3, 1, 'Module 1', 2, 'Basic Concepts', 'Understanding the core fundamentals.', '2026-04-26 13:31:27', '2026-04-26 13:31:27', '2026-04-26 13:31:27'),
(3, 1, 3, 1, 'Module 1', 3, 'Key Terminologies', 'Important terms used in the course.', '2026-04-26 13:31:27', '2026-04-26 13:31:27', '2026-04-26 13:31:27'),
(4, 1, 3, 1, 'Module 2', 4, 'Intermediate Topics', 'Diving deeper into the subject.', '2026-04-26 13:31:27', '2026-04-26 13:31:27', '2026-04-26 13:31:27'),
(5, 1, 3, 1, 'Module 2', 5, 'Practical Examples', 'Applying concepts through examples.', '2026-04-26 13:31:27', '2026-04-26 13:31:27', '2026-04-26 13:31:27'),
(6, 1, 3, 1, 'Module 2', 6, 'Case Study', 'Analyzing a real-world scenario.', '2026-04-26 13:31:27', '2026-04-26 13:31:27', '2026-04-26 13:31:27'),
(7, 1, 3, 1, 'Module 3', 7, 'Advanced Techniques', 'Exploring advanced methods.', '2026-04-26 13:31:27', '2026-04-26 13:31:27', '2026-04-26 13:31:27'),
(8, 1, 3, 1, 'Module 3', 8, 'Tools and Resources', 'Helpful tools for learning.', '2026-04-26 13:31:27', '2026-04-26 13:31:27', '2026-04-26 13:31:27'),
(9, 1, 3, 1, 'Module 3', 9, 'Common Mistakes', 'Things to avoid.', '2026-04-26 13:31:27', '2026-04-26 13:31:27', '2026-04-26 13:31:27'),
(10, 1, 3, 1, 'Module 4', 10, 'Final Review', 'Summary and preparation for assessment.', '2026-04-26 13:31:27', '2026-04-26 13:31:27', '2026-04-26 13:31:27');

-- --------------------------------------------------------

--
-- Table structure for table `lesson_files`
--

CREATE TABLE `lesson_files` (
  `lesson_file_id` int(10) UNSIGNED NOT NULL,
  `lesson_id` int(10) UNSIGNED NOT NULL,
  `url` varchar(2048) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `uploaded_by` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lesson_files`
--

INSERT INTO `lesson_files` (`lesson_file_id`, `lesson_id`, `url`, `original_name`, `uploaded_by`, `created_at`, `updated_at`) VALUES
(1, 1, 'https://example.com/files/lesson1.pdf', 'lesson1.pdf', 1, '2026-04-26 13:31:28', '2026-04-26 13:31:28'),
(2, 2, 'https://example.com/files/lesson2.pdf', 'lesson2.pdf', 1, '2026-04-26 13:31:28', '2026-04-26 13:31:28'),
(3, 3, 'https://example.com/files/lesson3.pdf', 'lesson3.pdf', 1, '2026-04-26 13:31:28', '2026-04-26 13:31:28'),
(4, 4, 'https://example.com/files/lesson4.pdf', 'lesson4.pdf', 1, '2026-04-26 13:31:28', '2026-04-26 13:31:28'),
(5, 5, 'https://example.com/files/lesson5.pdf', 'lesson5.pdf', 1, '2026-04-26 13:31:28', '2026-04-26 13:31:28'),
(6, 6, 'https://example.com/files/lesson6.pdf', 'lesson6.pdf', 1, '2026-04-26 13:31:28', '2026-04-26 13:31:28'),
(7, 7, 'https://example.com/files/lesson7.pdf', 'lesson7.pdf', 1, '2026-04-26 13:31:28', '2026-04-26 13:31:28'),
(8, 8, 'https://example.com/files/lesson8.pdf', 'lesson8.pdf', 1, '2026-04-26 13:31:28', '2026-04-26 13:31:28'),
(9, 9, 'https://example.com/files/lesson9.pdf', 'lesson9.pdf', 1, '2026-04-26 13:31:28', '2026-04-26 13:31:28'),
(10, 10, 'https://example.com/files/lesson10.pdf', 'lesson10.pdf', 1, '2026-04-26 13:31:28', '2026-04-26 13:31:28');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_04_25_000001_rename_users_id_to_user_id', 2);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sections`
--

CREATE TABLE `sections` (
  `section_id` int(10) UNSIGNED NOT NULL,
  `course_id` int(10) UNSIGNED NOT NULL,
  `subject_id` int(10) UNSIGNED NOT NULL,
  `instructor_id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(255) NOT NULL,
  `schedule` varchar(100) NOT NULL,
  `meeting_url` varchar(255) DEFAULT NULL,
  `meeting_starts_at` varchar(20) DEFAULT NULL,
  `meeting_ends_at` varchar(20) DEFAULT NULL,
  `created_at` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sections`
--

INSERT INTO `sections` (`section_id`, `course_id`, `subject_id`, `instructor_id`, `code`, `schedule`, `meeting_url`, `meeting_starts_at`, `meeting_ends_at`, `created_at`, `updated_at`) VALUES
(1, 2, 3, 1, 'BSCS 3A', 'Thursday', 'https://meet.google.com/landing', '9:30 AM', '11:30 AM', '2026-04-25 12:59:09', '2026-04-25 05:16:13'),
(2, 1, 2, 1, 'BSCS 2A', 'Thursday', NULL, '9:30 AM', '10:30 AM', '2026-04-26 03:13:24', '2026-04-26 02:50:57');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('0equfet6bYZWiT50zQl4F4clRN2uFCywI8UwLe7C', NULL, '::1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8115', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib0pVZDM0Q0pmMlp0T2NST3dRSktPQWJtUXpHOWwzeVFZdU01R2QzdSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjI6Imh0dHA6Ly9sb2NhbGhvc3QvbG9naW4iO3M6NToicm91dGUiO3M6NToibG9naW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1777254124),
('BBgYJIt0AhBcCsX15YVlcK32XFDKn4ymM9X9Ucu7', NULL, '::1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8115', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNjMxZXp0VWxkYm5EWTV3QXh3ZkN6Y285ZGZSSlNXSlJuQXRaQVFOVSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjI6Imh0dHA6Ly9sb2NhbGhvc3QvbG9naW4iO3M6NToicm91dGUiO3M6NToibG9naW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1777256405),
('cqGJa3r3c12Q2rLMvExQFkGgj2F6BqHCAqVHcuvJ', NULL, '::1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8115', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVTJmaEYweGR6aEI4N01NeUl4TGtJTW9rcGczNXpiTFJJTEttVTBIZSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjI6Imh0dHA6Ly9sb2NhbGhvc3QvbG9naW4iO3M6NToicm91dGUiO3M6NToibG9naW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1777254083),
('DohMQPpu7mBOaIQ1V4495uIZnGM6UWfIiP0jn2TS', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQmhYZWZZWEJWOE80RTZJOFBuaGJyVm5QaktEWFpjY3VSdXFiNmI0diI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjI6Imh0dHA6Ly9sb2NhbGhvc3QvbG9naW4iO3M6NToicm91dGUiO3M6NToibG9naW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1777257531),
('essxcC9FAHN0ynooIUYlMSH6Sqf5EGxDd8qezVor', NULL, '::1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8115', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidVJoZjhPQU52eW5ZYXVXYU5oYUNkTzluc1FTVmJ2cWxDRFlITE1DbSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjI6Imh0dHA6Ly9sb2NhbGhvc3QvbG9naW4iO3M6NToicm91dGUiO3M6NToibG9naW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1777253931),
('HNFgQD8SZcQZ5yAszPoBL9nJEUSZtZ6Nk19ihmLq', NULL, '::1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8115', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUHBMSDlwOVNvSGhwOVRKdElyT0JvWHZzaUV4Nmc3TXJKUVREQW5xRyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjI6Imh0dHA6Ly9sb2NhbGhvc3QvbG9naW4iO3M6NToicm91dGUiO3M6NToibG9naW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1777253903),
('k2UsZ3bh25590iioJ5XEOmsR4HrqhXbkrKWqMFtD', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.117.0 Chrome/142.0.7444.265 Electron/39.8.7 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTmZMSktqN21JWnhtQnpSRlIyTDdIeVRtUHk3VVVJbklBS0ZaS2dBdSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjI6Imh0dHA6Ly9sb2NhbGhvc3QvbG9naW4iO3M6NToicm91dGUiO3M6NToibG9naW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1777253836),
('WOq2seDTCcFVDJzC0jRnioA53U8gdp7V0XAgHtk8', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibVIxVTFqNFhCVFBmUzdGSjhSVkF4ZEdlMzVmVUxPQ1MxVU1zdTRTRSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjI6Imh0dHA6Ly9sb2NhbGhvc3QvbG9naW4iO3M6NToicm91dGUiO3M6NToibG9naW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1777253572),
('wz7Ad5uorElF5cCwwiHQkti2i7C2cRl8coRTCnaQ', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieE0yUnQ5a2t4TVNPbkRqekcxcHFtVW82d3c2RzFzaktoSGdGb3F3OCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjI6Imh0dHA6Ly9sb2NhbGhvc3QvbG9naW4iO3M6NToicm91dGUiO3M6NToibG9naW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1777257218);

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `student_id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `year_level` int(11) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `student_number` varchar(50) NOT NULL,
  `course_id` int(10) UNSIGNED DEFAULT NULL,
  `branch_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`student_id`, `first_name`, `middle_name`, `last_name`, `email`, `year_level`, `user_id`, `student_number`, `course_id`, `branch_id`, `created_at`, `updated_at`) VALUES
(1, 'Evander', 'Villareal', 'Wines', 'winesevander@gmail.com', 1, 1, '23-01115', 1, 1, '2026-04-08 08:36:15', '2026-04-25 15:38:23'),
(6, 'Test', 'Test', 'Test', 'test@test.com', 1, 10, '23-01116', 1, 1, '2026-04-26 02:12:50', '2026-04-26 02:12:50');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `subject_id` int(10) UNSIGNED NOT NULL,
  `course_id` int(10) UNSIGNED NOT NULL,
  `name` varchar(200) NOT NULL,
  `code` varchar(100) DEFAULT NULL,
  `semester` int(11) NOT NULL DEFAULT 1,
  `units` decimal(3,1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`subject_id`, `course_id`, `name`, `code`, `semester`, `units`, `created_at`, `updated_at`) VALUES
(1, 1, 'Introduction to Programming', 'CS101', 1, 3.0, '2026-04-08 09:35:04', '2026-04-08 09:35:04'),
(2, 1, 'Data Structures', 'CS201', 1, 3.0, '2026-04-08 09:35:04', '2026-04-08 09:35:04'),
(3, 2, 'Principles of Management', 'BA101', 1, 3.0, '2026-04-08 09:35:04', '2026-04-08 09:35:04'),
(4, 3, 'Statics and Dynamics', 'CE101', 1, 4.0, '2026-04-08 09:35:04', '2026-04-08 09:35:04'),
(5, 2, 'Test', 'test3', 1, 3.0, '2026-04-25 07:11:43', '2026-04-25 07:11:43');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `role` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'active',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `name`, `email`, `email_verified_at`, `role`, `password`, `status`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Evander Wines', 'winesevander@gmail.com', NULL, 'administrator', '$2y$12$gnTw27s7FXentaz/DF.mHuP9vFgsPeAu8AbTjTX8.vwTim1jqdAse', 'active', NULL, '2026-04-07 17:09:54', '2026-04-08 20:08:21'),
(2, 'Alice Santos', 'alice.santos@example.com', NULL, 'instructor', '$2y$12$gnTw27s7FXentaz/DF.mHuP9vFgsPeAu8AbTjTX8.vwTim1jqdAse', 'active', NULL, NULL, NULL),
(3, 'Ben Cruz', 'ben.cruz@example.com', NULL, 'instructor', '$2y$12$gnTw27s7FXentaz/DF.mHuP9vFgsPeAu8AbTjTX8.vwTim1jqdAse', 'active', NULL, NULL, NULL),
(4, 'Carla Reyes', 'carla.reyes@example.com', NULL, 'instructor', '$2y$12$gnTw27s7FXentaz/DF.mHuP9vFgsPeAu8AbTjTX8.vwTim1jqdAse', 'active', NULL, NULL, NULL),
(10, 'Test Test Test', 'test@test.com', NULL, 'student', '$2y$12$1ubCRDtGA98ArdbcBLIK0uKTRB2APFr.9XMSMC6uPAWeZvyom0mmi', 'active', NULL, '2026-04-26 02:12:50', '2026-04-26 02:12:50');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`branch_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`course_id`),
  ADD KEY `fk_courses_branch` (`branch_id`),
  ADD KEY `fk_courses_department` (`department_id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`department_id`),
  ADD KEY `fk_departments_branch` (`branch_id`);

--
-- Indexes for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`enrollment_id`),
  ADD KEY `fk_enrollments_section` (`section_id`),
  ADD KEY `fk_enrollments_student` (`student_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `instructors`
--
ALTER TABLE `instructors`
  ADD PRIMARY KEY (`instructor_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_instructors_user` (`user_id`),
  ADD KEY `fk_instructors_branch` (`branch_id`),
  ADD KEY `fk_instructors_department` (`department_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lessons`
--
ALTER TABLE `lessons`
  ADD PRIMARY KEY (`lesson_id`),
  ADD KEY `fk_lessons_section` (`section_id`),
  ADD KEY `fk_lessons_subject` (`subject_id`),
  ADD KEY `fk_lessons_instructor` (`instructor_id`);

--
-- Indexes for table `lesson_files`
--
ALTER TABLE `lesson_files`
  ADD PRIMARY KEY (`lesson_file_id`),
  ADD KEY `fk_lesson_files_lesson` (`lesson_id`),
  ADD KEY `fk_lesson_files_uploader` (`uploaded_by`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `sections`
--
ALTER TABLE `sections`
  ADD PRIMARY KEY (`section_id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `fk_sections_course` (`course_id`),
  ADD KEY `fk_sections_subject` (`subject_id`),
  ADD KEY `fk_sections_instructor` (`instructor_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`student_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `student_number` (`student_number`),
  ADD KEY `fk_students_user` (`user_id`),
  ADD KEY `fk_students_course` (`course_id`),
  ADD KEY `fk_students_branch` (`branch_id`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`subject_id`),
  ADD KEY `fk_subjects_course` (`course_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `branches`
--
ALTER TABLE `branches`
  MODIFY `branch_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `course_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `department_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `enrollment_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `instructors`
--
ALTER TABLE `instructors`
  MODIFY `instructor_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lessons`
--
ALTER TABLE `lessons`
  MODIFY `lesson_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `lesson_files`
--
ALTER TABLE `lesson_files`
  MODIFY `lesson_file_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `sections`
--
ALTER TABLE `sections`
  MODIFY `section_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `student_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `subject_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `fk_courses_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`branch_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_courses_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`) ON DELETE CASCADE;

--
-- Constraints for table `departments`
--
ALTER TABLE `departments`
  ADD CONSTRAINT `fk_departments_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`branch_id`) ON DELETE CASCADE;

--
-- Constraints for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `fk_enrollments_section` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_enrollments_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE;

--
-- Constraints for table `instructors`
--
ALTER TABLE `instructors`
  ADD CONSTRAINT `fk_instructors_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`branch_id`),
  ADD CONSTRAINT `fk_instructors_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`),
  ADD CONSTRAINT `fk_instructors_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `lessons`
--
ALTER TABLE `lessons`
  ADD CONSTRAINT `fk_lessons_instructor` FOREIGN KEY (`instructor_id`) REFERENCES `instructors` (`instructor_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_lessons_section` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_lessons_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`) ON DELETE CASCADE;

--
-- Constraints for table `lesson_files`
--
ALTER TABLE `lesson_files`
  ADD CONSTRAINT `fk_lesson_files_lesson` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`lesson_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_lesson_files_uploader` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `sections`
--
ALTER TABLE `sections`
  ADD CONSTRAINT `fk_sections_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_sections_instructor` FOREIGN KEY (`instructor_id`) REFERENCES `instructors` (`instructor_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_sections_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`) ON DELETE CASCADE;

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `fk_students_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`branch_id`),
  ADD CONSTRAINT `fk_students_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`),
  ADD CONSTRAINT `fk_students_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `subjects`
--
ALTER TABLE `subjects`
  ADD CONSTRAINT `fk_subjects_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
