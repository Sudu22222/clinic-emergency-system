-- Run once on an existing HealthPulse database to enable doctor-owned clinic listings.
USE `healthpulse_db`;

ALTER TABLE `healthcare_directory`
  ADD COLUMN `owner_user_id` INT DEFAULT NULL,
  ADD COLUMN `doctor_name` VARCHAR(100) DEFAULT NULL,
  ADD COLUMN `available_rooms` INT DEFAULT 0,
  ADD COLUMN `total_rooms` INT DEFAULT 0;
