-- HealthPulse Database Setup Script for phpMyAdmin / MySQL / XAMPP
-- Import this SQL file directly in phpMyAdmin to set up all tables and indexes.

CREATE DATABASE IF NOT EXISTS `healthpulse_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `healthpulse_db`;

-- --------------------------------------------------------
-- 1. Users Table (Authentication for Doctor/Admin & Patients)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_code` VARCHAR(50) UNIQUE NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('doctor', 'patient') NOT NULL DEFAULT 'patient',
  `phone` VARCHAR(50) DEFAULT NULL,
  `blood_group` VARCHAR(10) DEFAULT NULL,
  `location` VARCHAR(255) DEFAULT NULL,
  `specialty` VARCHAR(100) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- 2. Patients Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `patients` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `age` INT DEFAULT NULL,
  `gender` VARCHAR(20) DEFAULT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `blood_group` VARCHAR(10) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `emergency_contact` VARCHAR(100) DEFAULT NULL,
  `medical_notes` TEXT DEFAULT NULL,
  `registered_date` DATE NOT NULL,
  `user_id` INT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- 3. Appointments Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `appointments` (
  `id` VARCHAR(50) PRIMARY KEY,
  `patient_id` VARCHAR(50) DEFAULT NULL,
  `patient_name` VARCHAR(100) NOT NULL,
  `patient_phone` VARCHAR(50) NOT NULL,
  `patient_blood_group` VARCHAR(10) NOT NULL,
  `doctor_id` VARCHAR(50) NOT NULL,
  `doctor_name` VARCHAR(100) NOT NULL,
  `doctor_specialty` VARCHAR(100) NOT NULL,
  `date` DATE NOT NULL,
  `time_slot` VARCHAR(50) NOT NULL,
  `visit_reason` TEXT NOT NULL,
  `priority` VARCHAR(20) DEFAULT 'Normal',
  `status` VARCHAR(20) DEFAULT 'Upcoming',
  `created_by_user_id` INT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- 4. Ambulance Dispatches Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `ambulance_dispatches` (
  `id` VARCHAR(50) PRIMARY KEY,
  `dispatch_code` VARCHAR(50) UNIQUE NOT NULL,
  `patient_name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `pickup_address` TEXT NOT NULL,
  `urgency` VARCHAR(20) NOT NULL,
  `status` VARCHAR(20) DEFAULT 'Pending',
  `assigned_unit` VARCHAR(100) DEFAULT NULL,
  `driver_name` VARCHAR(100) DEFAULT NULL,
  `driver_phone` VARCHAR(50) DEFAULT NULL,
  `eta` VARCHAR(50) DEFAULT NULL,
  `coord_x` INT DEFAULT 50,
  `coord_y` INT DEFAULT 50,
  `destination` VARCHAR(255) DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_by_user_id` INT DEFAULT NULL,
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- 5. Blood Banks Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `blood_banks` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `location` VARCHAR(255) DEFAULT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `distance` VARCHAR(50) DEFAULT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `available_units_json` TEXT DEFAULT NULL,
  `is_verified` BOOLEAN DEFAULT TRUE,
  `operating_hours` VARCHAR(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- 6. Blood Requirements Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `blood_requirements` (
  `id` VARCHAR(50) PRIMARY KEY,
  `patient_name` VARCHAR(100) NOT NULL,
  `blood_group` VARCHAR(10) NOT NULL,
  `units_needed` INT NOT NULL DEFAULT 1,
  `hospital_location` VARCHAR(255) NOT NULL,
  `urgency` VARCHAR(50) NOT NULL,
  `contact_person` VARCHAR(100) NOT NULL,
  `contact_phone` VARCHAR(50) NOT NULL,
  `posted_at` VARCHAR(50) DEFAULT NULL,
  `status` VARCHAR(20) DEFAULT 'Open',
  `notes` TEXT DEFAULT NULL,
  `created_by_user_id` INT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- 7. Healthcare Directory Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `healthcare_directory` (
  `id` VARCHAR(50) PRIMARY KEY,
  `owner_user_id` INT DEFAULT NULL,
  `doctor_name` VARCHAR(100) DEFAULT NULL,
  `name` VARCHAR(150) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `address` TEXT NOT NULL,
  `area` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `emergency_helpline` VARCHAR(50) NOT NULL,
  `status` VARCHAR(50) DEFAULT 'Open',
  `available_rooms` INT DEFAULT 0,
  `total_rooms` INT DEFAULT 0,
  `available_beds` INT DEFAULT 0,
  `total_beds` INT DEFAULT 0,
  `distance` VARCHAR(50) DEFAULT NULL,
  `rating` DECIMAL(3,1) DEFAULT 4.5,
  `services_json` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
