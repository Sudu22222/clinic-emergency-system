-- Run once only when upgrading a database created from the earlier HealthPulse schema.
USE `healthpulse_db`;

ALTER TABLE `patients`
  MODIFY `age` INT DEFAULT NULL,
  MODIFY `gender` VARCHAR(20) DEFAULT NULL,
  ADD COLUMN `user_id` INT DEFAULT NULL;

ALTER TABLE `appointments`
  ADD COLUMN `created_by_user_id` INT DEFAULT NULL;

ALTER TABLE `ambulance_dispatches`
  ADD COLUMN `created_by_user_id` INT DEFAULT NULL;

ALTER TABLE `blood_requirements`
  ADD COLUMN `created_by_user_id` INT DEFAULT NULL;

ALTER TABLE `healthcare_directory`
  ADD COLUMN `owner_user_id` INT DEFAULT NULL,
  ADD COLUMN `doctor_name` VARCHAR(100) DEFAULT NULL,
  ADD COLUMN `available_rooms` INT DEFAULT 0,
  ADD COLUMN `total_rooms` INT DEFAULT 0;