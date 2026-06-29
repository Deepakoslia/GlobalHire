-- GlobalHire Database Schema
-- MySQL 8.0+ | utf8mb4 | Production-ready

CREATE DATABASE IF NOT EXISTS globalhire
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE globalhire;

-- ---------------------------------------------------------------------------
-- Users (platform accounts — admin, sales, etc.)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email         VARCHAR(255)    NOT NULL,
  password_hash VARCHAR(255)    NOT NULL,
  first_name    VARCHAR(100)    NOT NULL,
  last_name     VARCHAR(100)    NOT NULL,
  role          ENUM('admin', 'sales', 'support', 'viewer') NOT NULL DEFAULT 'viewer',
  is_active     TINYINT(1)      NOT NULL DEFAULT 1,
  last_login_at DATETIME        NULL,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_role_active (role, is_active),
  KEY idx_users_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Leads (general marketing / inbound interest)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS leads (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email        VARCHAR(255)    NOT NULL,
  first_name   VARCHAR(100)    NULL,
  last_name    VARCHAR(100)    NULL,
  company      VARCHAR(200)    NULL,
  job_title    VARCHAR(150)    NULL,
  country      VARCHAR(100)    NULL,
  source       VARCHAR(100)    NULL DEFAULT 'website',
  status       ENUM('new', 'contacted', 'qualified', 'converted', 'closed') NOT NULL DEFAULT 'new',
  notes        TEXT            NULL,
  created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_leads_email (email),
  KEY idx_leads_status (status),
  KEY idx_leads_source_created (source, created_at),
  KEY idx_leads_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Demo requests
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS demo_requests (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email           VARCHAR(255)    NOT NULL,
  first_name      VARCHAR(100)    NOT NULL,
  last_name       VARCHAR(100)    NOT NULL,
  company         VARCHAR(200)    NOT NULL,
  job_title       VARCHAR(150)    NULL,
  phone           VARCHAR(50)     NULL,
  employee_count  ENUM('1-50', '51-200', '201-1000', '1000+') NULL,
  countries       VARCHAR(500)    NULL COMMENT 'Comma-separated target hire countries',
  message         TEXT            NULL,
  status          ENUM('pending', 'scheduled', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  ip_address      VARCHAR(45)     NULL,
  user_agent      VARCHAR(500)    NULL,
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_demo_requests_email (email),
  KEY idx_demo_requests_status (status),
  KEY idx_demo_requests_company (company),
  KEY idx_demo_requests_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Contact form messages
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_messages (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email       VARCHAR(255)    NOT NULL,
  first_name  VARCHAR(100)    NOT NULL,
  last_name   VARCHAR(100)    NOT NULL,
  company     VARCHAR(200)    NULL,
  subject     VARCHAR(200)    NOT NULL,
  message     TEXT            NOT NULL,
  status      ENUM('new', 'in_progress', 'resolved', 'spam') NOT NULL DEFAULT 'new',
  ip_address  VARCHAR(45)     NULL,
  user_agent  VARCHAR(500)    NULL,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_contact_messages_email (email),
  KEY idx_contact_messages_status (status),
  KEY idx_contact_messages_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Newsletter subscribers
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email           VARCHAR(255)    NOT NULL,
  first_name      VARCHAR(100)    NULL,
  status          ENUM('active', 'unsubscribed', 'bounced') NOT NULL DEFAULT 'active',
  source          VARCHAR(100)    NULL DEFAULT 'website',
  subscribed_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at DATETIME        NULL,
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_newsletter_email (email),
  KEY idx_newsletter_status (status),
  KEY idx_newsletter_subscribed_at (subscribed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
