-- Email Collector Database Setup
-- Run this script in your MySQL server

-- Create database
CREATE DATABASE IF NOT EXISTS email_collector;
USE email_collector;

-- Create emails table
CREATE TABLE IF NOT EXISTS emails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);

-- Insert sample data (optional)
-- INSERT INTO emails (email) VALUES 
-- ('test1@example.com'),
-- ('test2@example.com'),
-- ('test3@example.com');

-- Show table structure
DESCRIBE emails;

-- Show all emails
SELECT * FROM emails ORDER BY created_at DESC;