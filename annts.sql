-- MySQL dump converted from PostgreSQL
-- Dumped from PostgreSQL version 13.22
-- Converted for MySQL compatibility
-- Note: Arrays (text[]) converted to JSON type.
-- Booleans converted to TINYINT(1) (1=true, 0=false).
-- Timestamps with time zone converted to TIMESTAMP.
-- Sequences replaced with AUTO_INCREMENT.
-- Ignored PostgreSQL-specific elements like owners, ACLs, and schemas.
-- Assumed MySQL 5.7+ for JSON support.
-- Data with arrays converted to JSON format (e.g., '{val}' -> '["val"]').
-- Truncated data in the original dump is preserved as-is; missing parts are not inferred.

CREATE DATABASE IF NOT EXISTS myczroxg_annhurst;
USE myczroxg_annhurst;

-- Table: admins
-- Use VARCHAR(255) or appropriate length instead of TEXT for columns that need defaults
-- TEXT/BLOB/JSON columns in MySQL cannot have a literal default value (except NULL)

CREATE TABLE admins (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'editor',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    name VARCHAR(255),
    avatar VARCHAR(512),
    password VARCHAR(255),
    banned TINYINT(1) DEFAULT 0,
    UNIQUE KEY uk_admins_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Unique index
ALTER TABLE admins ADD UNIQUE KEY admins_email_key (email);

-- Data for admins
INSERT INTO admins VALUES (1, 'admin@annhurst-gsl.com', 'admin', '2025-11-02 21:57:41.591', 'Administrator', NULL, '$2b$10$JJHyZZ/vQal34Pt5xRWIt.ykAhAKogNDynmFApkTJrJbb1BM.eSly', 0);
INSERT INTO admins VALUES (3, 'deboraheidehen@gmail.com', 'viewer', '2025-11-02 21:57:41.597', 'Deborah', NULL, '$2b$10$LL1d5QQ/ccuWgW5nr6SCl.7C5JR3RAElyomB6c4cjFt.vtG.sKZ5y', 0);
INSERT INTO admins VALUES (4, 'cereoah@annhurst-gsl.com', 'editor', '2025-11-25 15:15:50.137', 'Cleophas Ereoah', NULL, '$2b$10$EE06e3rRgVVyvAM8dfszhOsh2/mlEbARaT9wO2oUYOZFA7sJHvxbK', 0);
INSERT INTO admins VALUES (2, 'dutibe@annhurst-gsl.com', 'admin', '2025-11-02 21:57:41.595', 'David', NULL, '$2b$10$YY/LB53hHkO5rXhDaM8a5uLJF9AjS2LWKX6I633CZxICiXVuTz33K', 0);

-- Table: bus_status_history
CREATE TABLE bus_status_history (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    bus BIGINT NOT NULL,
    status TEXT NOT NULL,
    note TEXT,
    changed_by BIGINT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Data for bus_status_history
INSERT INTO bus_status_history VALUES (1, 14, 'Letter Issued', 'Old Letter', 2, '2025-12-03 21:29:01.075');
INSERT INTO bus_status_history VALUES (2, 18, 'Letter Issued', 'Old letter', 2, '2025-12-03 21:29:49.61');
INSERT INTO bus_status_history VALUES (3, 15, 'Letter Issued', 'Old letter', 2, '2025-12-03 21:30:34.187');
INSERT INTO bus_status_history VALUES (4, 17, 'Letter Issued', 'Old letter', 2, '2025-12-03 21:31:01.729');
INSERT INTO bus_status_history VALUES (5, 20, 'Letter Issued', 'Old letter', 2, '2025-12-03 21:31:41.478');
INSERT INTO bus_status_history VALUES (6, 5, 'Completed', 'Payment Completed on 02/12/2025', 2, '2025-12-03 22:02:13.942');
INSERT INTO bus_status_history VALUES (7, 17, 'Completed', 'Payment Completed on 24/11/2025', 2, '2025-12-03 22:03:37.958');
INSERT INTO bus_status_history VALUES (8, 20, 'Completed', 'Payment completed at 14/11/2025', 2, '2025-12-03 22:05:43.165');
INSERT INTO bus_status_history VALUES (9, 15, 'Completed', 'Payment Completed 19/10/2025', 2, '2025-12-03 22:08:37.279');

-- Table: buses
CREATE TABLE buses (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    bus_code TEXT,
    driver BIGINT,
    letter TINYINT(1),
    e_payment BIGINT,
    contract_date DATE,
    agreed_date DATE,
    date_collected DATE,
    start_date DATE,
    first_pay DATE,
    initial_owe BIGINT,
    deposited BIGINT,
    t_income BIGINT,
    plate_no TEXT,
    coordinator BIGINT
);

-- Data for buses
INSERT INTO buses VALUES (3, '2025-09-03 16:40:53', 'M01', 2, 0, 65000, '2025-06-20', '2027-03-14', '2025-07-11', '2025-07-14', '2025-07-20', 5863000, 300000, 783000, 'KTU 211 YL', 1);
INSERT INTO buses VALUES (4, '2025-09-03 16:46:19', 'L08', 1, 0, 60000, '2025-04-07', '2027-01-03', '2025-04-12', '2025-04-14', '2025-04-20', 5600000, 250000, 1685000, 'KTU 725 YK', 4);
INSERT INTO buses VALUES (5, '2025-09-09 19:14:12.828486', 'TR', 5, 0, 50000, '2023-08-28', '2024-12-29', '2023-08-30', '2023-08-28', '2023-09-10', 3500000, 100000, 2825000, 'GGE 257 YH', 2);
INSERT INTO buses VALUES (6, '2025-09-09 19:15:53.034765', 'I03', 4, 0, 50000, '2024-10-04', '2025-11-30', '2024-10-04', '2024-10-13', '2024-11-03', 2400000, 0, 1820000, 'GGE 413 YH', 4);
INSERT INTO buses VALUES (7, '2025-09-09 20:23:13.234599', 'J03', 6, 0, 50000, '2025-02-17', '2025-12-07', '2025-02-18', '2025-02-27', '2025-03-02', 2000000, 0, 1350000, 'KRD 464 YH', 4);
INSERT INTO buses VALUES (8, '2025-09-09 20:24:14.559983', 'J09', 7, 0, 40000, '2024-10-05', '2026-07-03', '2024-08-26', '2024-08-26', '2024-09-01', 2000000, 0, 1845000, 'FST 212YH', 3);
INSERT INTO buses VALUES (9, '2025-09-09 20:25:44.945142', 'K02', 8, 0, 40000, '2024-10-04', '2026-01-11', '2024-10-04', '2024-10-13', '2024-10-20', 2670000, 100000, 1940000, 'LSD 536 YJ', 1);
INSERT INTO buses VALUES (10, '2025-09-09 20:26:21.503686', 'K04', 9, 0, 50000, '2025-05-08', '2026-03-12', '2025-05-10', '2025-05-25', '2025-05-25', 2000000, 0, 800000, 'EKY 410YJ', 1);
INSERT INTO buses VALUES (11, '2025-09-09 20:27:04.019718', 'K05', 10, 0, 50000, '2025-05-11', '2026-03-23', '2025-05-11', '2025-05-18', '2025-05-19', 2300000, 0, 800000, 'LSD 537 YJ', 3);
INSERT INTO buses VALUES (12, '2025-09-09 20:27:39.227802', 'K06', 11, 0, 50000, '2024-01-31', '2025-10-26', '2024-02-02', '2024-02-05', '2024-02-10', 3700000, 150000, 3430000, 'LSD 882YJ', 1);
INSERT INTO buses VALUES (13, '2025-09-09 20:28:16.693386', 'K07', 12, 0, 50000, '2025-01-13', '2025-11-16', '2025-01-21', '2025-01-26', '2025-02-03', 2200000, 100000, 1700000, 'LSD 881YJ', 1);
INSERT INTO buses VALUES (14, '2025-09-09 20:28:58.421118', 'K08', 13, 1, 70000, '2025-02-07', '2025-12-07', '2025-02-07', '2025-02-10', '2025-02-23', 2200000, 100000, 1520000, 'FKJ 142YJ', 4);
INSERT INTO buses VALUES (15, '2025-09-09 20:29:29.30857', 'K09', 14, 1, 60000, '2024-01-25', '2025-11-09', '2024-02-19', '2024-02-19', '2024-02-26', 3700000, 150000, 3390000, 'FKJ 141YJ', 1);
INSERT INTO buses VALUES (16, '2025-09-09 20:30:06.35824', 'K10', 15, 0, 40000, '2024-03-08', '2025-12-07', '2024-03-11', '2024-03-12', '2024-03-17', 3700000, 125000, 3235000, 'FST 576YJ', 4);
INSERT INTO buses VALUES (17, '2025-09-09 20:30:40.627265', 'K11', 16, 1, 55000, '2024-03-11', '2025-12-14', '2024-03-11', '2024-03-12', '2024-03-18', 3700000, 125000, 3219000, 'FST 579YJ', 1);
INSERT INTO buses VALUES (18, '2025-09-09 20:31:07.618633', 'K12', 17, 1, 80000, '2025-02-07', '2025-12-07', '2025-02-07', '2025-02-10', '2025-02-17', 2200000, 100000, 1500000, 'FST 578YJ', 3);
INSERT INTO buses VALUES (19, '2025-09-09 20:31:40.229398', 'K13', 18, 0, 40000, '2024-03-09', '2025-11-16', '2024-03-09', '2024-03-11', '2024-03-17', 3600000, 150000, 3270000, 'FST 581YJ', 3);
INSERT INTO buses VALUES (20, '2025-09-11 10:01:04.332924', 'K14', 19, 1, 50000, '2024-03-09', '2025-11-16', '2024-03-09', '2024-03-11', '2024-03-18', 3600000, 150000, 3220000, 'FST 580YJ', 1);
INSERT INTO buses VALUES (21, '2025-09-11 10:35:29.016175', 'K15', 20, 0, 50000, '2025-01-23', '2025-12-21', '2025-01-27', '2025-02-03', '2025-02-10', 2600000, 100000, 1600000, 'FST 686YJ', 1);
INSERT INTO buses VALUES (22, '2025-09-11 10:54:44.876506', 'K16', 21, 0, 50000, '2024-03-01', '2025-12-21', '2024-04-05', '2024-04-08', '2024-04-15', 3600000, 150000, 3090000, 'FST 685YJ', 1);
INSERT INTO buses VALUES (23, '2025-09-11 11:02:00.295453', 'K17', 22, 0, 40000, '2024-04-19', '2026-01-18', '2024-04-23', '2024-04-24', '2024-04-29', 3700000, 150000, 3045000, 'AGL 52YJ', 1);
INSERT INTO buses VALUES (24, '2025-09-11 11:05:54.392229', 'K18', 23, 0, 40000, '2024-04-19', '2026-01-04', '2024-04-24', '2024-04-25', '2024-04-29', 3600000, 150000, 2765000, 'AGL 50YJ', 1);
INSERT INTO buses VALUES (25, '2025-09-11 11:09:33.036853', 'L01', 24, 0, 60000, '2025-02-13', '2026-11-22', '2025-02-14', '2025-02-17', '2025-02-23', 5700000, 250000, 1990000, 'MUS 950YH', 4);
INSERT INTO buses VALUES (26, '2025-09-11 11:12:16.921415', 'L02', 25, 0, 60000, '2025-02-09', '2026-11-15', '2025-02-09', '2025-02-10', '2025-02-15', 5600000, 249999, 2050000, 'MUS 949YH', 3);
INSERT INTO buses VALUES (27, '2025-09-11 11:15:15.837171', 'L03', 26, 0, 60000, '2025-03-03', '2026-12-20', '2025-03-13', '2025-03-17', '2025-03-23', 5700000, 250000, 1750000, 'KTU 720YK', 3);
INSERT INTO buses VALUES (28, '2025-09-11 11:17:55.761468', 'L04', 27, 0, 60000, '2025-02-14', '2026-12-09', '2025-03-14', '2025-02-17', '2025-03-23', 5600000, 250000, 1750000, 'KTU 721YK', 4);
INSERT INTO buses VALUES (29, '2025-09-11 11:25:51.917493', 'L05', 28, 0, 60000, '2025-03-03', '2026-12-20', '2025-03-14', '2025-03-17', '2025-03-23', 5700000, 250000, 1750000, 'KTU 722YK', 3);
INSERT INTO buses VALUES (30, '2025-09-11 11:29:16.222978', 'L06', 29, 0, 60000, '2025-03-03', '2026-12-09', '2025-03-14', '2025-02-17', '2025-03-23', 5600000, 250000, 1750000, 'KTU 723YK', 3);
INSERT INTO buses VALUES (31, '2025-09-11 11:33:49.639145', 'L09', 30, 0, 60000, '2025-03-03', '2026-12-20', '2025-03-14', '2025-03-17', '2025-03-23', 5700000, 250000, 1570000, 'SMK 834YK', 3);
INSERT INTO buses VALUES (32, '2025-09-11 11:37:14.598275', 'L10', 31, 0, 60000, '2025-03-03', '2027-03-07', '2025-06-01', '2025-03-16', '2025-06-08', 5700000, 250000, 1070000, 'KRD 741 YL', 3);
INSERT INTO buses VALUES (33, '2025-09-11 11:39:56.306258', 'L11', 32, 0, 60000, '2025-03-03', '2027-03-07', '2025-05-31', '2025-06-02', '2025-06-08', 5700000, 250000, 1070000, 'EKY 427 YL', 3);
INSERT INTO buses VALUES (34, '2025-09-11 11:44:27.049009', 'L12', 33, 0, 60000, '2025-05-04', '2027-03-07', '2025-05-31', '2025-06-02', '2025-06-08', 5700000, 250000, 1070000, 'KRD 740 YL', 3);
INSERT INTO buses VALUES (35, '2025-09-11 11:54:49.701549', 'L13', 34, 0, 60000, '2025-03-30', '2027-03-07', '2025-03-31', '2025-06-02', '2025-06-08', 5700000, 250000, 1070000, 'EKY 428 YL', 4);
INSERT INTO buses VALUES (36, '2025-09-11 11:57:58.259216', 'L14', 35, 0, 60000, '2025-05-25', '2027-03-07', '2025-05-31', '2025-06-02', '2025-06-08', 5700000, 250000, 1070000, 'KRD 742 YL', 4);
INSERT INTO buses VALUES (37, '2025-09-11 12:16:24.549921', 'L15', 36, 0, 65000, '2025-06-01', '2027-02-07', '2025-06-01', '2025-06-02', '2025-06-26', 5900000, 400000, 1090000, 'KRD 739 YL', 4);
INSERT INTO buses VALUES (38, '2025-09-11 12:20:39.390789', 'L16', 37, 0, 60000, '2025-05-31', '2027-02-21', '2025-05-31', '2025-06-02', '2025-06-08', 5600000, 250000, 1070000, 'KRD 743 YL', 3);
INSERT INTO buses VALUES (39, '2025-09-11 12:24:54.033635', 'L17', 38, 0, 60000, '2025-05-31', '2027-02-21', '2025-06-02', '2025-06-02', '2025-06-08', 5600000, 250000, 1070000, 'KRD 744 YL', 4);
INSERT INTO buses VALUES (40, '2025-09-11 12:27:30.614012', 'L18', 39, 0, 65000, '2025-05-31', '2027-01-31', '2025-06-01', '2025-06-02', '2025-06-08', 5900000, 300000, 1185000, 'EKY 429 YL', 4);
INSERT INTO buses VALUES (41, '2025-09-11 12:30:30.753594', 'M02', 40, 0, 65000, '2025-06-13', '2027-03-21', '2025-07-11', '2025-07-14', '2025-07-20', 6000000, 300000, 845000, 'KTU 213 YL', 1);
INSERT INTO buses VALUES (42, '2025-09-11 12:32:46.532898', 'M03', 41, 0, 65000, '2025-06-26', '2027-04-11', '2025-08-01', '2025-08-04', NULL, 6000000, 300000, 625000, 'AKD 885 YL', 3);
INSERT INTO buses VALUES (43, '2025-09-12 09:19:55.289516', 'M04', 42, 0, 65000, '2025-06-05', '2027-03-21', '2025-07-14', '2025-07-14', '2025-07-18', 6000000, 300000, 820000, 'KTU 210 YL', 1);
INSERT INTO buses VALUES (44, '2025-09-12 09:22:19.542034', 'M05', 43, 0, 65000, '2025-06-04', '2027-04-11', '2025-07-26', '2025-07-28', '2025-08-03', 6000000, 300000, 665000, 'KTU 172 YL', 3);
INSERT INTO buses VALUES (45, '2025-09-12 09:25:06.916746', 'M06', 44, 0, 65000, '2025-03-27', '2027-03-28', '2025-07-26', '2025-07-28', '2025-07-20', 6000000, 300000, 795000, 'KTU 209 YL', 3);
INSERT INTO buses VALUES (46, '2025-09-12 09:27:34.998531', 'M07', 45, 0, 65000, '2025-06-30', '2027-03-28', '2025-07-26', '2025-07-28', '2025-08-02', 6000000, 300000, 665000, 'KTU 173 YL', 3);
INSERT INTO buses VALUES (47, '2025-09-12 09:29:51.297426', 'M08', 46, 0, 65000, '2025-06-23', '2027-04-11', '2025-07-26', '2025-07-28', '2025-08-02', 6000000, 300000, 665000, 'KTU 171 YL', 4);
INSERT INTO buses VALUES (48, '2025-09-12 09:32:39.188793', 'M09', 47, 0, 65000, '2025-06-23', '2027-04-11', '2025-07-26', '2025-07-28', '2025-08-01', 6000000, 300000, 665000, 'KTU 144 YL', 4);
INSERT INTO buses VALUES (49, '2025-09-12 09:35:40.459571', 'M10', 48, 0, 65000, '2025-06-04', '2027-03-14', '2025-07-11', '2025-07-14', '2025-07-20', 5900000, 300000, 820000, 'KTU 212 YL', 1);
INSERT INTO buses VALUES (50, '2025-09-12 09:37:41.955274', 'M11', 49, 0, 65000, '2025-07-02', '2027-04-04', '2025-08-01', '2025-08-04', '2025-08-10', 5900000, 300000, 625000, 'AKD 887 YL', 4);
INSERT INTO buses VALUES (51, '2025-09-12 09:40:26.614582', 'M12', 50, 0, 65000, '2025-06-30', '2027-08-09', '2025-08-30', '2025-09-07', '2025-09-07', 6000000, 300000, 365000, 'AKD 276 YL', 4);
INSERT INTO buses VALUES (52, '2025-09-12 09:42:48.168187', 'M13', 51, 0, 65000, '2025-06-30', '2027-03-28', '2025-07-26', '2025-07-28', '2025-08-03', 5900000, 300000, 665000, 'KTU 170 YL', 4);
INSERT INTO buses VALUES (53, '2025-09-12 09:44:43.496694', 'M15', 52, 0, 65000, '2025-07-21', '2027-04-11', '2025-08-01', '2025-08-04', '2025-08-10', 6000000, 300000, 625000, 'AKD 886 YL', 3);
INSERT INTO buses VALUES (54, '2025-09-12 09:49:55.072157', 'M17', 53, 0, 65000, '2025-07-07', '2027-05-09', '2025-08-31', '2025-09-01', '2025-09-08', 5900000, 300000, 355000, 'AKD 278 YL', 1);
INSERT INTO buses VALUES (55, '2025-09-12 09:52:25.755547', 'M18', 54, 0, 65000, '2025-06-20', '2027-03-28', '2025-07-26', '2025-07-28', '2025-09-03', 5900000, 300000, 665000, 'KTU 169 YL', 1);
INSERT INTO buses VALUES (56, '2025-10-09 11:41:54.407076', 'N04', 57, 0, 65000, '2025-09-30', '2027-02-04', '2025-09-27', '2025-09-28', '2025-10-05', 6500000, 300000, 365000, 'AKD 922 YL', 4);
INSERT INTO buses VALUES (57, '2025-10-10 12:36:53.100984', 'N01', 55, 0, 65000, '2025-09-12', '2027-03-05', '2025-08-30', '2025-09-07', '2025-10-05', 6000000, 300000, 3650000, 'AKD 235 YL', 4);
INSERT INTO buses VALUES (58, '2025-10-10 12:41:36.363819', 'N02', 56, 0, 65000, '2025-08-23', '2027-03-05', '2025-08-30', '2025-09-07', '2025-10-05', 6500000, 300000, 0, 'AKD 913 YL', 3);
INSERT INTO buses VALUES (59, '2025-10-10 12:44:45.303126', 'N07', 58, 0, 65000, '2025-08-23', '2027-05-03', '2025-08-30', '2025-09-07', '2025-10-05', 6000000, 65000, 365000, 'AKD 249 YL', 1);
INSERT INTO buses VALUES (60, '2025-10-10 12:49:03.72093', 'N13', 59, 0, 65000, '2025-09-27', '2027-03-03', '2025-08-30', '2025-09-07', '2025-10-05', 6000000, 299999, 365000, 'AKD 930 YL', 4);
INSERT INTO buses VALUES (61, '2025-10-10 12:53:23.968345', 'N15', 60, 0, 65000, '2025-08-30', '2027-02-07', '2025-08-30', '2025-09-07', '2025-09-07', 6000000, 300000, 699000, 'AKD 277 YL', 3);
INSERT INTO buses VALUES (62, '2025-12-03 11:28:54.281', 'N14', 61, 0, 65000, '2025-07-21', '2027-07-25', '2025-11-12', '2025-11-13', '2025-11-18', 6000000, 300000, 395000, 'BDG 761 YL', 4);
INSERT INTO buses VALUES (1, '2025-09-03 15:53:51', 'L07', 3, 0, 60000, '2025-04-07', '2027-01-03', '2025-04-12', '2025-04-14', '2025-04-20', 5600000, 250000, 3450000, 'KTU 724 YK', 4);

-- Table: co_subject
CREATE TABLE co_subject (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    subject TEXT
);

-- Data for co_subject (empty in dump)

-- Table: contact
CREATE TABLE contact (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    coordinator BIGINT,
    driver BIGINT,
    subject BIGINT,
    transaction_date DATE,
    message TEXT,
    is_starred TINYINT(1),
    is_read TINYINT(1),
    attachment TEXT,
    sender TEXT,
    receiver TEXT,
    sender_email TEXT,
    receiver_email TEXT
);

-- Data for contact (partial, as truncated in original)
INSERT INTO contact VALUES (1, '2025-09-19 11:10:53.421441', 4, 1, 1, NULL, 'When will you pay?', NULL, 1, NULL, 'Cleophas', 'TAIWO TOLA SEUN', 'ereoahcleophas@gmail.com', 'taiwo@annhurst-ts.com');
INSERT INTO contact VALUES (2, '2025-09-19 11:15:45.731371', 4, 3, 4, NULL, 'I have gear issue, that is why i will delay payment', NULL, 1, NULL, 'ESSIEN ELIZABETH', 'Cleophas', 'essien@annhurst-ts.com', 'ereoahcleophas@gmail.com');
-- Note: Original dump truncated here; no more contact data provided.

-- Table: contact_us
CREATE TABLE contact_us (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    name TEXT,
    email TEXT,
    phone TEXT,
    company TEXT,
    subject TEXT,
    message TEXT
);

-- Data for contact_us (empty in dump)

-- Table: coordinators
CREATE TABLE coordinators (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    email VARCHAR(255),
    password VARCHAR(255),
    name VARCHAR(255),
    avatar VARCHAR(512),
    phone JSON,
    user_id CHAR(36),
    banned TINYINT(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for coordinators
-- Make sure the coordinators table uses JSON for the phone column and VARCHAR for user_id
-- Run this once if you haven't already:
ALTER TABLE coordinators 
    MODIFY phone JSON,
    MODIFY user_id CHAR(36);

-- Now insert the 4 coordinators (100% working in MySQL)
INSERT INTO coordinators (id, created_at, email, password, name, avatar, phone, user_id, banned) VALUES
(1, '2025-11-02 21:57:41', 'chuksmanny97@gmail.com', '$2b$10$C.SmZ1kgoDckWZcyyzn5oe92q2W4yyxb4JDDCSoDfz0wWmrDVZ7qm', 'Emmanuel', NULL, '["09054257289"]', '8f05ba64-005d-4c56-b426-3badd4596c0f', 0),
(2, '2025-11-02-11-02 21:57:41', 'abisomukailaabiso@gmail.com', '$2b$10$9EE9HssIFrTnPNhX/0APt.RcJiB9jGEefpyO.2Dk61GGAt46gxEme', 'Mukaila', NULL, '["09063750685"]', '646ee4e2-f49f-4789-bb75-0bec72a64d60', 0),
(3, '2025-11-02 21:57:41', 'rolandogbaisi75@gmail.com', '$2b$10$g/ymd7RjN3EfZxM4KzFp6uGLqBEo.OoLtLZ7mkbuQgZJxBIBH1JTe', 'Roland', NULL, '["08122574825"]', 'd74e5de5-02e4-4bd1-9249-92ca931012f5', 0),
(4, '2025-11-02 21:57:41', 'ereoahcleophas@gmail.com', '$2b$10$PlWiI/EeLf6dQazDGXS5OezLMPZmkDAG79ySRPnVvC859LvNaOuem', 'Cleophas', NULL, '["07065226741"]', '1a145b44-0dc3-41d1-b024-36fbca710578', 0);

-- Table: driver
CREATE TABLE driver (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    email VARCHAR(255),
    password VARCHAR(255),
    name VARCHAR(255),
    avatar VARCHAR(512),
    dob VARCHAR(20),
    nin BIGINT,
    phone JSON,
    address JSON,
    kyc TINYINT(1) DEFAULT 0,
    banned TINYINT(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for driver (partial, as truncated)
-- Note: Converted {val} to ["val"] for JSON fields
INSERT INTO driver (id, created_at, email, password, name, avatar, dob, nin, phone, address, kyc, banned) VALUES
(5, '2025-11-02 21:57:42.289', 'kenedy@annhurst-ts.com', '$2b$10$T30BHnAohpZFLybXiBkGIeZSsISp4BAlWvDDwEDNsGtNvQcJRzPdu', 'Kenedy Idialu', NULL, '1990-02-09', 12345678901, '["09016289173"]', '["Mama Bar street","Itedo Lekki Lagos Nigeria"]', 0, 0),
(6, '2025-11-02 21:57:42.365', 'ismaheel@annhurst-ts.com', '$2b$10$ytVGsE.veAos7smJvrcFouPeg1B13cEMTmbJICIWnGK3vGMdWxI1G', 'Ismaheel Lawal', NULL, '1990-01-09', 12345678901, '["08114660214"]', '["30 Lekki farm road","After farm City","Lekki phase 1","Lagos Nigeria"]', 0, 0),
(7, '2025-11-02 21:57:42.437', 'bashiru@annhurst-ts.com', '$2b$10$JG0GdLc0APhyHaiIfl/bWOkpF8Z./lRNlEC6bF6kazHnCYUqT14RO', 'Bashiru Kunmi Sunday', NULL, '1990-05-09', 12345678901, '["08037397161"]', '["HSE 2","Okunusi Mopo off Oyinbo Road","Ajah Lagos Nigeria"]', 0, 0),
(8, '2025-11-02 21:57:42.509', 'ayodele@annhurst-ts.com', '$2b$10$A8ZeF9jpoE0Rz0N7zwMOqeSJOlOtK3H9z8qgLLoICDHl9TEuQfhOC', 'Ayodele Rasheed', NULL, '1990-09-09', 12345678901, '["08112756959"]', '["Ojo-Oto Bulala bus stop Okun Mopo Abraham Adesanya Ajah Lagos Nigeria"]', 0, 0),
(9, '2025-11-02 21:57:42.581', 'sanusi@annhurst-ts.com', '$2b$10$jfEljuKcHwpaOs1lUDkuveEhO/lrYql5iY4VdHvK7iia2lGFu1pIK', 'Sanusi Taofeek Adesina', NULL, '1989-05-09', 12345678901, '["07062771436"]', '["Plot 2","Layi yusuf crescent","off admiralty way lekki phase 1 Lagos Nigeria"]', 0, 0),
(10, '2025-11-02 21:57:42.660', 'abdullahi@annhurst-ts.com', '$2b$10$z4BzC2qJXHOw/n8prNjZ2.l3o8DbvJh1p3d2UdZEKmEEmGitctoeG', 'Abdullahi Yusuf', NULL, '1990-01-09', 12345678901, '["07089670810"]', '["1","Saka Oluguna orile maroko","Ajah Lagos Nigeria"]', 0, 0),
(11, '2025-11-02 21:57:42.737', 'aderemi@annhurst-ts.com', '$2b$10$agIr7vNsT39/elGojQCwTeb8vipFfnrc8iK7VSt5UMg.kwkG7c3vm', 'Aderemi Rufai Safiu', NULL, '1990-10-09', 12345678901, '["08119946144"]', '["Ifedapo street","Baba nla lekki farm Lagos Nigeria"]', 0, 0),
(12, '2025-11-02 21:57:42.810', 'fadare@annhurst-ts.com', '$2b$10$sVpCsIydqttI1AO0q/gIPenyeoOK6V2RZG5U1GD40njqxAs3QPScS', 'Fadare Sarafadeen Adewale', NULL, '1990-12-09', 12345678901, '["08136194190"]', '["11 Akilo Road","Agege Ogba road","Agege Lagos Nigeria"]', 0, 0),
(13, '2025-11-02 21:57:42.882', 'adepoju@annhurst-ts.com', '$2b$10$KXwQDvC1a2bQ9SWiD1jNB.e7wygvrJzq4KwLiDQm.fKRpB4QnapJa', 'Adepoju Babatunde Adebowale', NULL, '1990-10-09', 12345678901, '["09138461046"]', '["17 Temidire Ajaguro Imota Ikorodu Lagos Nigeria"]', 0, 0),
(14, '2025-11-02 21:57:42.956', 'damola@annhurst-ts.com', '$2b$10$xW2My57TBXeySyPBHo92P.kfgPpEnG6TVTCV6xWvnk9zJMEEqJMhG', 'DAMOLA SHOWOBI MUMEEN', NULL, '1990-05-09', 12345678901, '["08030779806"]', '["Back of poultry","green house","tipper garage bus stop","eleko Lagos Nigeria"]', 0, 0),
(15, '2025-11-02 21:57:43.029', 'kolajo@annhurst-ts.com', '$2b$10$Ms7dcFxA5TEJmcwvLMi7WuwNOG8XVDei7pkQtZqMQHCargBs80AQe', 'Kolajo Isaac', NULL, '1990-11-09', 12345678901, '["08033697112"]', '["5","Sanni Eleku street","Awoyaya","ibeju Lekki Lagos Nigeria"]', 0, 0),
(16, '2025-11-02 21:57:43.102', 'maliki@annhurst-ts.com', '$2b$10$hi24Sq58LjJ/GGtptnsNKuAkY6JW8VjzRpkKZWh/5/EIP0jqEy.jW', 'Maliki Simpa Yahaya', NULL, '1990-06-09', 12345678901, '["08070518881","09130461493"]', '["48","TALABI STR","OKE IJEBU ODONLA IKORODU"]', 0, 0),
(17, '2025-11-02 21:57:43.177', 'hange@annhurst-ts.com', '$2b$10$1.Sv8xUxf6UdOSo2OQRzkuoCu3cQGsQl2vw7VUICZ6G3LT6RFyUFC', 'HANGE TERHEMEN BENJAMIN', NULL, '1990-04-09', 12345678901, '["08146923004"]', '["6","Oluwalogbon Oworonshoki Lagos Nigeria"]', 0, 0),
(18, '2025-11-02 21:57:43.255', 'ajayi@annhurst-ts.com', '$2b$10$jmnA3f2Usw9P5NfGmmbcFOD6ZKtv0rsqPGXhGqiWCjBl7HmeVJ1NO', 'Ajayi Akorede Segun', NULL, '1990-12-09', 12345678901, '["08028316736"]', '["21B Adedayo Adedeji street","Abanje road","IKOTUN Lagos Nigeria"]', 0, 0),
(19, '2025-11-02 21:57:43.329', 'ridwan@annhurst-ts.com', '$2b$10$kGu9z/6wsPqZhaiV.1xb3OEY/4jp4ysOw1Syycro32gKdyzYM6do2', 'OLAMILEKAN RIDWAN', NULL, '1990-01-10', 12345678901, '["07065705493"]', '["169 PRINCE ADEMOLA ROAD OFF ONIRU ESTATE"]', 0, 0),
(20, '2025-11-02 21:57:43.403', 'abbas@annhurst-ts.com', '$2b$10$.Z1rTiCwyALwNr2QsyfT1eCIDYYW53Q.72Od1R7geDTWp52ihWsbC', 'ABBAS ABDULLAHI', NULL, '1990-07-24', 12345678901, '["08028453325"]', '["7","MOBIL ROAD","AJAH"]', 0, 0),
(21, '2025-11-02 21:57:43.483', 'livinus@annhurst-ts.com', '$2b$10$5HJLFyLYvOeUHBjycw6MzOaWZbRMUU.AdIwwUcyhsTPNlVvOHDNty', 'LIVINUS PETER AKWITAL', NULL, '1990-10-15', 12345678901, '["08113049993"]', '["3/4","ODO OGUN CLOSE OFF KEFFI OBALENDE"]', 0, 0),
(22, '2025-11-02 21:57:43.556', 'olaoye@annhurst-ts.com', '$2b$10$xqQQMheFJn66gg586DZPyugDnWym7JmCbP7W7eejqlbDg2ogkVkhG', 'OLAOYE OLADEJI', NULL, '1990-12-16', 12345678901, '["07012298111"]', '["PRIME OLAYINKA STR","MOBILE ROAD","AJAH"]', 0, 0),
(23, '2025-11-02 21:57:43.628', 'balogun@annhurst-ts.com', '$2b$10$2vOkek.8TW8sS7mfEmAQ0ODVuAcqjINsBrJ5T0w8fQi7T41AAyJDq', 'OLARENWAJU YUSUF BALOGUN', NULL, '1990-05-13', 12345678901, '["08147117310"]', '["10 AGUGI AJIREN LEKKI LAGOS NIGERIA"]', 0, 0),
(24, '2025-11-02 21:57:43.710', 'laitan@annhurst-ts.com', '$2b$10$Grdoms/O5jqCDqQMdkXzW.polpLfrxFzaoamzYcVhVTT.z9.2yHdK', 'LAITAN TAJUDEEN SHOWOBI', NULL, '1990-02-22', 12345678901, '["08028871638"]', '["18","ALPHA BEACH","NEW ROAD LEKKI"]', 0, 0),
(25, '2025-11-02 21:57:43.783', 'muritala@annhurst-ts.com', '$2b$10$ObW4pzvpvVY9bLTj65dBNuQKWs/l5gwTeZDqZ6kxdAfKxAo.6GMUO', 'MURITALA AKANDE ORI-ADE', NULL, '1990-08-08', 12345678901, '["09075800613"]', '["3","ATUNRASE ALAKUKO AGBADO"]', 0, 0),
(26, '2025-11-02 21:57:43.856', 'abini@annhurst-ts.com', '$2b$10$KkbgAAFuG316hMNcNwwNoOODD60Uj4hlNRUb.XXnnA59gS2ERBoka', 'MONDAY ABINI AJAYI', NULL, '1990-09-17', 12345678901, '["09067083030","07060853526"]', '["54","ISALE IJEBU STREET","AJAH LAGOS"]', 0, 0),
(27, '2025-11-02 21:57:43.933', 'ihedigbo@annhurst-ts.com', '$2b$10$7XIFRk0toR5xhYU/Mksw6e/wvpz.ibIx13Ui3/6sn/UogRjEP4rQ6', 'JOSHUA IHEDIGBO', NULL, '1990-09-17', 12345678901, '["09125699739"]', '["ROAD 6","RIO GARDEN ESTATE ARAROMI"]', 0, 0),
(28, '2025-11-02 21:57:44.010', 'samson@annhurst-ts.com', '$2b$10$jolGSNFELs6rkb28MV3JDOho9SlZ.tuP2DR.KFz8wUauQeJzywSk2', 'MONDAY SAMSON UDOETETE', NULL, '1990-12-06', 12345678901, '["08141517792"]', '["8","OWOPEJO CLOSE","SHAPATI IBEJU LEKKI"]', 0, 0),
(29, '2025-11-02 21:57:44.083', 'aderibigbe@annhurst-ts.com', '$2b$10$YV4QrwM5V7sYjUI9bR1uVuJVTQqvIsKkvAr9MI23J9AOlXJI19o4e', 'LANRE ADERIBIGBE', NULL, '1990-04-29', 12345678901, '["08038295709"]', '["12","BALEGI AVENUE","IGODO MAGBORO OGUN STATE"]', 0, 0),
(30, '2025-11-02 21:57:44.161', 'sodiq@annhurst-ts.com', '$2b$10$SNofr0rojmAo3up5FAo35eZ9hbh8wnKloRpV4fY9FOFVwHJPaba/W', 'MOHAMMED SODIQ', NULL, '1990-07-08', 12345678901, '["08080289082"]', '["6","FOREST OFF IGBOEFON BUS STOP LEKKI"]', 0, 0),
(31, '2025-11-02 21:57:44.235', 'wasiu@annhurst-ts.com', '$2b$10$IY1fHikckgueDeiwVcErTujqgabOOqXEpVlsD124Xq3iSZ7Z2c1Eq', 'WASIU ADELEKE', NULL, '1990-11-25', 12345678901, '["09122515577"]', '["6","EJIO STREET","ODONLA","IKORODU","LAGOS"]', 0, 0),
(32, '2025-11-02 21:57:44.311', 'azeez@annhurst-ts.com', '$2b$10$YfbkiHQTKOHSKEHmFWiY4.9Yf7EJjZiiU2v.D87FmIyAnWUgBUwKm', 'IBRAHIM ABDULAZEEZ ALIU', NULL, '1990-04-24', 12345678901, '["08037921475"]', '["2","OYALEYE CLOSE","ALIMOSHO"]', 0, 0),
(33, '2025-11-02 21:57:44.385', 'ayandele@annhurst-ts.com', '$2b$10$Zf305TKRlii5OZe8nZaTjuUBfnQiMkKhPJ9VUpHZj0AO2HFbKuzi2', 'AYANDELE YUSUF OLAREWAJU', NULL, '1990-11-06', 12345678901, '["09071221212"]', '["13","JIDE AWAWO STREET","OFF WAZOBIA BUS STOP","IKOTUN","LAGOS"]', 0, 0),
(34, '2025-11-02 21:57:44.458', 'sylvanus@annhurst-ts.com', '$2b$10$GwiRXZURa28i8ANLWLwIV.LwS3WbX5mwqp7SMCsK05CZECSKLAThe', 'VICTOR SYLVANUS UMOH', NULL, '1990-11-12', 12345678901, '["09016038311"]', '["6","MUNIRU PAPA STREET","ALAGUNTAN","AJAH"]', 0, 0),
(35, '2025-11-02 21:57:44.536', 'hamzat@annhurst-ts.com', '$2b$10$s/xPU3jP552xlM9AvhpIveKDi6HAzeWYY30FIITGTs0LBnrOF9jve', 'HAMZAT IBRAHIM OLAMILEKAN', NULL, '1990-11-15', 12345678901, '["08118209670","08079750783"]', '["5","ABULE PARAPO","OFF DEEPER LIFE","AWOYAYA","IBEJU LEKKI"]', 0, 0),
(36, '2025-11-02 21:57:44.609', 'okon@annhurst-ts.com', '$2b$10$NSEPIETqtw7HvV5cSFlWeeWhVMWWnVfhS6NCc3vGuaG1sAOgaLgKm', 'EFFIONG ESSIEN OKON', NULL, '1990-08-05', 12345678901, '["08023497731"]', '["12","PEDRIS STREET","ILAJE","MOBIL ROAD","AJAH"]', 0, 0),
(37, '2025-11-02 21:57:44.682', 'bidemi@annhurst-ts.com', '$2b$10$QoSyKn0XjwMNVNsWFtTDUOfhLT/.xnUJBmstKYEF5MJigpAQTauQe', 'OBIYELE TUNDE BIDEMI', NULL, '1990-09-27', 12345678901, '["09035378114"]', '["24","BASHORUN JUNCTION","IGBOGBO","IKORODU","LAGOS"]', 0, 0),
(38, '2025-11-02 21:57:44.761', 'kodi@annhurst-ts.com', '$2b$10$gpN/9Q9IwUtpkwauPNz8Vu1AHWmnO5JFrkJyfrQusogZzCER6/nw6', 'KODI DONALD', NULL, '1990-02-21', 12345678901, '["08038160136","07032151313"]', '["48","OFFICE DEPOT","MAJEK","IBEJU LEKKI","LAGOS"]', 0, 0),
(39, '2025-11-02 21:57:44.834', 'ndimele@annhurst-ts.com', '$2b$10$haTfI5GbioUS7vNifE7aFuqkqIOudRrh0oltvSKtXBcj1cu4NudjK', 'NDIMELE PRECIOUS OLUCHI', NULL, '1990-04-26', 12345678901, '["08069602794"]', '["10,"OSEREN KOJO GANDER STREET","OFF ADEBA BUS STOP","LAKOWE"]', 0, 0),
(40, '2025-11-02 21:57:44.909', 'okem@annhurst-ts.com', '$2b$10$E6Ca2HgS1vQMpif73rtNc.EEv3DJQVuB2ZVebvsBzKKF1N1UoWkfC', 'DANIEL OKEM UGBEM', NULL, '1990-11-20', 12345678901, '["08113401089"]', '["2A","OKOAWO STREET","OPPOSITE EKO HOTEL","ROUNDABOUT","VI"]', 0, 0),
(41, '2025-11-02 21:57:44.981', 'alonge@annhurst-ts.com', '$2b$10$VYyiI5mqrugTTZ5U6vNs2OWTZmI2AsIAMI83DzThsB8G6zXOgWBp6', 'DARE JACOB ALONGE', NULL, '1990-11-26', 12345678901, '["08062741343"]', '["59","ADESAN ROAD","OFF MADAM POULTRY BUS STOP","MOWE","OGUN STATE"]', 0, 0),
(42, '2025-11-02 21:57:45.059', 'oshualale@annhurst-ts.com', '$2b$10$z39PnFKI6rHq9o83vdDowOWUOoZC.AmtXM/WBxYefuQxCOzOSaQFm', 'BASHIRU TAIWO OSHUALALE', NULL, '1990-06-13', 12345678901, '["09125557316"]', '["71","HAMMED STREET","MOPO AKINLADE","ABRAHAM ADESANYA"]', 0, 0),
(43, '2025-11-02 21:57:45.132', 'ege@annhurst-ts.com', '$2b$10$c1AOGZMR/CwDrYRejDe2H.gJhKLnlsoLirAbsi.zk6grdBrlQ8CFC', 'OLADIMEJI KAZEEM EGE', NULL, '1990-08-05', 12345678901, '["09026787560"]', '["4","LAYI YUSUF STREET","OFF ADMIRALTY WAY","LEKKI PHASE 1"]', 0, 0),
(44, '2025-11-02 21:57:45.206', 'sabo@annhurst-ts.com', '$2b$10$30/SHgz79L/.n1PHQOkMc.hqkEVENLy841fHAcFYxLAWDmFHfgqIa', 'BENNY SABO FAVOUR SIMON', NULL, '1990-04-29', 12345678901, '["07072805008","09127226095"]', '["1","PATRICK OKNJE","GBARADA NNPC BUS STOP","IBEJU LEKKI"]', 0, 0),
(45, '2025-11-02 21:57:45.279', 'godspower@annhurst-ts.com', '$2b$10$5WduX3eY4ZtTzdGJNT.nzeLIYCrJyGsN1hs2ojVn0/WJT3wHDGNne', 'GODSPOWER SUNNY OGAGA', NULL, '1990-11-13', 12345678901, '["08037027177"]', '["1","AL-ITAJJAJ STREET","OFF PLANTINUM WAY","JAKANDE FIST GATE","LEKKI"]', 0, 0),
(46, '2025-11-02 21:57:45.355', 'osunjimi@annhurst-ts.com', '$2b$10$TD4sdDDZhyE460MvvAfoD.iIl.tLtxZimt5bwey/1vJSDTnPFeDJW', 'LAWRENCE ADEBAYO OSUNJIMI', NULL, '1990-09-02', 12345678901, '["08036005363"]', '["6","HOTEL STREET","IGBOJIYA ROAD","MOLETE TOWN","IBEJU LEKKI"]', 0, 0),
(47, '2025-11-02 21:57:45.429', 'ogunloye@annhurst-ts.com', '$2b$10$ptQk/zNASMBeWRYoEakjwuWNnoZ8.bf8UxDNJe8s1PboRSEVM1HkO', 'OLALEKAN WAHAB OGUNLOYE', NULL, '1990-11-20', 12345678901, '["07061432081"]', '["2","ORIKUTA STREET","OGIJO","IKORODU"]', 0, 0),
(48, '2025-11-02 21:57:45.502', 'oshati@annhurst-ts.com', '$2b$10$oiBwth5/qijXOrBL8VI0yut6ySS8F5x6WAKSV5RaVCXi4UARE/iZe', 'IMOLE EMMANUEL OSHATI', NULL, '1990-12-11', 12345678901, '["09051310413"]', '["3","VFC CLOSE","OFF STILL WATER","IKATE ELEGUSHI","LEKKI"]', 0, 0),
(49, '2025-11-02 21:57:45.578', 'tsunday@annhurst-ts.com', '$2b$10$LimoY4D0bHgqBeqPWngQTOLeYCxE7d82KhbF5pHGkrdWv9nXCN9yi', 'EMMANUEL TUNDE SUNDAY', NULL, '1990-10-30', 12345678901, '["08104391373"]', '["BLOCK 15","FLAT 4","ROAD 401","ABRAHAM ADESANYA ESTATE","AJAH"]', 0, 0),
(50, '2025-11-02 21:57:45.652', 'adeniji@annhurst-ts.com', '$2b$10$vnz3ARhoqrhz7/jrIlL/7O.rkUmOJsGfDMKU0Z0Ke3APvYxCphXwC', 'ADEDEJI FEMI ADENIJI', NULL, '1990-12-11', 12345678901, '["08127332045"]', '["57","BAALE AYIETORO","OFF AYETORO BOUNDARY","AJEGUNLE","APAPA"]', 0, 0),
(51, '2025-11-02 21:57:45.728', 'etimothy@annhurst-ts.com', '$2b$10$rtTd9RzY2tNnXOv0O1SPN.PQhghEPoSF22YGyCr7EOl0cMklXbY82', 'EMMANUEL TIMOTHY', NULL, '1990-09-24', 12345678901, '["09163294627"]', '["23","ISALE IJEBU STREET","AJAH","LAGOS"]', 0, 0),
(52, '2025-11-02 21:57:45.802', 'aminat@annhurst-ts.com', '$2b$10$tzywSZmgpOD/CX6n11GgGeLNUqiDqcV20nlx7P9n0dRc/cDroAd.C', 'AMINAT OMOWUMI OYINLOLA', NULL, '1990-06-20', 12345678901, '["09154606854"]', '["24","IFA MOROTI STREET","ADDO ROAD","AJAH"]', 0, 0),
(53, '2025-11-02 21:57:45.890', 'ogar@annhurst-ts.com', '$2b$10$NNA17W4Ob7JjKgm4CBoGAOS696VHKna0O4MPq9TAIFfJtpYZ2ewte', 'OGAR KELVIN OGBAJI', NULL, '1990-07-25', 12345678901, '["07032933029"]', '["51","ISALE IJEBU STREET","OFF ALESH HOTEL","AJAH"]', 0, 0),
(54, '2025-11-02 21:57:45.967', 'umoru@annhurst-ts.com', '$2b$10$f8RHEz4Mm3gsYs0pE2L1JeowthorUg4E.K23pU/k7r6Qm2PdIrFGi', 'ELIJAH JUNIOR UMORU', NULL, '1990-10-23', 12345678901, '["07045419890"]', '["13","JEHOVAH WITHNESS","OKOLOMI","OFF LEKKI EPE EXPRESS WAY","BOGIJE"]', 0, 0),
(55, '2025-11-02 21:57:46.041', 'adebimpe@annhurst-ts.com', '$2b$10$bHbJgMMYaiIxHvkofOSjUu5m/pgwrYOt/s3Dk/fShE6b7PHtMKZwq', 'ADEBIMPE RUKAYAT ADEDIRAN', NULL, '1990-01-09', 12345678901, '["09054503143"]', '["HAMMED BY COMPLEX","OFF OKUN AJAH ROAD","MOPO AKINLADE"]', 0, 0),
(56, '2025-11-02 21:57:46.116', 'saheed@annhurst-ts.com', '$2b$10$4tCYfmJGbNrtQ7lNM1U.D.4U5jCmUXkpvSqsIHgKxVDRKgzI7E56y', 'SAHEED OWOLEMI OLAIDE', NULL, '1990-01-09', 12345678901, '["07038557029","09012656075"]', '["17","OLORUNTEDO","KOLA","MASALASHI BUS STOP","ALAKUKO","LAGOS"]', 0, 0),
(57, '2025-11-02 21:57:46.189', 'debam@annhurst-ts.com', '$2b$10$6cnGiDLEHVcx1X7bX7znaezdooj3l7Ep1Vjkks1v8V752tESAPpLW', 'DEBAM NICHOLAS AONDOYILA', NULL, '1990-01-14', 12345678901, '["07084693041"]', '["888","BALARABE MUSA CRESENT","VICTORIA ISLAND","LAGOS"]', 0, 0),
(58, '2025-11-02 21:57:46.265', 'andy@annhurst-ts.com', '$2b$10$8A.zXk2jToXAYhwoGvrC5u158LbWRt391Absyf9.Qf9iGZNoSKC1u', 'ANDY OBOR OTETE', NULL, '1991-10-08', 12347678901, '["09127996842"]', '["14","COMMUNITY STREET","ITA LUWO","IKORODU"]', 0, 0),
(59, '2025-11-02 21:57:46.338', 'george@annhurst-ts.com', '$2b$10$ACyPM.ePfXs/WeuHuBp1bO8YNpYyFQm8FvD.yyz/EMJcgssB.OQn.', 'GEORGE DAVID OWOLABI ALFRED', NULL, '1989-12-06', 12345678901, '["08146684722"]', '["18","KEBBI STREET","OSBORNE ESTATE","IKOYI"]', 0, 0),
(60, '2025-11-02 21:57:46.411', 'olufemi@annhurst-ts.com', '$2b$10$K/EUd72ZojAkIRbuhz/5D.WTq.UqS76z6JjDznM3IORKBm3S8vLNy', 'OLUFEMI ISAAC OLUTOBA', NULL, '1986-05-20', 12345678901, '["07046489367","08091163197"]', '["29","ARO - BABA STREET","OFF PIPELINE ROAD","IKOTUN","LAGOS"]', 0, 0),
(61, '2025-12-03 10:53:53.783', 'radediran@annhurst-ts.com', '$2b$10$yIiE1HIMcsiFt4GXfyC93urOf81oMpzpybl6FqASNN7g8iE1De92m', 'ROTIMI ADENIYI ADEDIRAN', NULL, '1990-01-01', 12345678901, '["07065266672"]', '["6","GOSHEN ROAD","UPDC ESTATE","MARWA","LAGOS NIGERIA"]', 0, NULL);


-- Table: expected_payment
CREATE TABLE expected_payment (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    bus BIGINT NOT NULL,
    week_start DATE NOT NULL,
    amount BIGINT NOT NULL,
    reason TEXT,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Unique index
ALTER TABLE expected_payment ADD UNIQUE KEY expected_payment_bus_week_start_key (bus, week_start);

-- Data for expected_payment (empty in dump)

-- Table: inspection
CREATE TABLE inspection (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    month DATE,
    coordinator TEXT,
    bus BIGINT,
    pdf TEXT,
    video TEXT,
    code TEXT,
    d_uploaded DATE,
    video_gp TEXT,
    plate_number TEXT,
    bus_uploaded TEXT,
    issue TEXT,
    both_vid_pdf TEXT,
    inspection_completed_by TEXT,
    issues TEXT
);

-- Data for inspection
INSERT INTO inspection VALUES (1, '2025-12-02 13:41:53.407', '2025-11-01', 'Emmanuel', 3, '/uploads/4b7cb6ec-5877-4e69-89d1-31d30ddcf8ed-M1.pdf', '/uploads/inspections/127c4196-0959-423b-9f7f-89bece70285d.mp4', '/uploads/inspections/781e3bd7-981a-43d0-b469-8b59e773bec2.webm', '2025-12-02', NULL, 'KTU 211 YL', NULL, 'None', 'YES', 'Emmanuel', 'No issues');
INSERT INTO inspection VALUES (2, '2025-12-02 15:11:43.205', '2025-11-01', 'Emmanuel', 9, NULL, '/uploads/inspections/de7cc55a-de31-4617-91a1-953eb53525d3.webm', '/uploads/inspections/56e51359-bc9e-47a7-9183-b34dd3f94d3b.webm', '2025-12-02', NULL, 'LSD 536 YJ', NULL, 'No', 'NO', 'Emmanuel', 'None');

-- Table: pages
CREATE TABLE pages (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    text TEXT NOT NULL,
    meta_description TEXT,
    is_published TINYINT(1) DEFAULT 0,
    views INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    hero_big_black TEXT,
    hero_big_primary TEXT,
    hero_text TEXT,
    hero_primary_button TEXT,
    hero_secondary_button TEXT,
    hero_year TEXT,
    hero_year_span TEXT,
    hero_100 TEXT,
    hero_100_span TEXT,
    hero_24 TEXT,
    hero_24_span TEXT,
    body_heading TEXT,
    body_sub_heading TEXT,
    body_first_text TEXT,
    body_second_text TEXT,
    body_heading2 TEXT,
    body_sub_heading2 TEXT,
    body_heading3 TEXT,
    body_sub_heading3 TEXT,
    body_heading4 TEXT,
    body_sub_heading4 TEXT,
    box_text TEXT,
    box_head TEXT,
    box_text2 TEXT,
    box_head2 TEXT,
    box_text3 TEXT,
    box_head3 TEXT,
    box_text4 TEXT,
    box_head4 TEXT,
    box_text5 TEXT,
    box_head5 TEXT,
    box_text6 TEXT,
    box_head6 TEXT,
    box_text7 TEXT,
    box_head7 TEXT,
    box_text8 TEXT,
    box_head8 TEXT,
    box_text9 TEXT,
    box_head9 TEXT,
    team_img TEXT,
    team_text TEXT,
    team_role TEXT,
    team_img2 TEXT,
    team_text2 TEXT,
    team_role2 TEXT,
    team_img3 TEXT,
    team_text3 TEXT,
    team_role3 TEXT,
    section_head TEXT,
    section_text TEXT,
    section_primary_btn TEXT,
    section_secondary_btn TEXT,
    hp JSON,
    fm JSON
);

-- Unique index
ALTER TABLE pages ADD UNIQUE KEY pages_slug_key (slug);

-- Data for pages
-- First make sure the pages table is correct (run once if not done yet)
ALTER TABLE pages 
    MODIFY slug VARCHAR(255) NOT NULL,
    MODIFY hp JSON,
    MODIFY fm JSON;

-- Now add the unique index (only if not exists yet)
ALTER TABLE pages ADD UNIQUE KEY pages_slug_key (slug);

INSERT INTO pages (id, title, slug, text, meta_description, is_published, views, created_at, updated_at,
    hero_big_black, hero_big_primary, hero_text, hero_primary_button, hero_secondary_button,
    hero_year, hero_year_span, hero_100, hero_100_span, hero_24, hero_24_span,
    body_heading, body_sub_heading, body_first_text, body_second_text,
    body_heading2, body_sub_heading2, body_heading3, body_sub_heading3,
    body_heading4, body_sub_heading4,
    box_text, box_head, box_text2, box_head2, box_text3, box_head3,
    box_text4, box_head4, box_text5, box_head5, box_text6, box_head6,
    box_text7, box_head7, box_text8, box_head8, box_text9, box_head9,
    team_img, team_text, team_role,
    team_img2, team_text2, team_role2,
    team_img3, team_text3, team_role3,
    section_head, section_text, section_primary_btn, section_secondary_btn,
    hp, fm) VALUES
(1, 'About Us', 'about', 'Our impact in numbers', 'Learn about our company mission and values', 1, 0,
 '2025-12-11 21:54:17', '2025-12-11 21:54:17',
 'About', 'Annhurst Transport', 'Leading the way in bus higher purchase solutions across Nigeria and beyond', '', '',
 '', '', '', '', '', '',
 'Our Story', '', 'Founded with a vision to democratize investment opportunities in Nigeria, Annhurst Transport Services Limited has been at the forefront of providing accessible, profitable investment options for individuals and businesses across the country.',
 'With over 5 years of proven excellence, we have built a reputation for reliability, transparency, and consistent returns. Our expertise spans across transportation, real estate, and business expansion sectors, making us your one-stop solution for investment opportunities.',
 'Driving growth in transportation', 'Our Purpose', 'The principles that guide us', 'Our Values',
 'Meet the experts behind our success', 'Our Team',
 'To provide accessible, reliable, and innovative financing solutions that empower transportation businesses to grow their fleets and expand their operations, contributing to economic development across Nigeria.', 'Our Mission',
 'To be the leading provider of transportation financing solutions in West Africa, recognized for our innovation, reliability, and commitment to customer success.', 'Our Vision',
 'We put our customers at the heart of everything we do, ensuring their success is our priority.', 'Customer First',
 'We strive for excellence in all aspects of our business, from customer service to financial solutions.', 'Excellence',
 'We continuously innovate our services to meet the evolving needs of the transportation industry.', 'Innovation',
 'Years in Business', '5+', 'Buses Financed', '200+', 'Satisfied Clients', '100+', 'Team Members', '25+',
 '', 'Strategic leadership and vision', 'Management Team',
 '', 'Specialized in transportation financing', 'Finance Experts',
 '', 'Dedicated to your success', 'Customer Support',
 '', 'Our team of experienced professionals brings together decades of expertise in transportation finance, customer service, and business development.',
 '', '', NULL, NULL),

(2, 'Services', 'services', 'From 12% APR', 'Comprehensive bus financing and management services', 1, 0,
 '2025-12-11 22:09:40', '2025-12-11 22:09:40',
 'Our', 'Services', 'Comprehensive bus financing solutions designed to help your transportation business grow and succeed',
 'Get Started', 'Learn More', 'Custom Pricing', '', '', '', '', '',
 'Complete financing solutions', 'What We Offer', 'From initial consultation to final payment, we provide end-to-end support for all your bus financing needs.', '',
 'Simple 4-step process', 'How It Works', 'Benefits that set us apart', 'Why Choose Us',
 'We''re here to help you succeed', 'Additional Support',
 'Our flagship service offering flexible higher purchase agreements for buses of all sizes and types. Perfect for businesses looking to expand their fleet while maintaining operational cash flow.', 'Higher Purchase',
 'Comprehensive fleet management services to help you optimize operations, reduce costs, and maximize the value of your bus fleet investment.', 'Fleet Management',
 'Submit your application with basic business information and requirements', 'Application',
 'Our team reviews your application and conducts necessary assessments', 'Review',
 'Receive approval and finalize terms of your financing agreement', 'Approval',
 'Get your buses and start growing your transportation business', 'Funding',
 'We offer some of the most competitive interest rates in the industry, helping you save money on your financing.', 'Competitive Rates',
 'Our streamlined process ensures quick approval and funding, so you can get your buses on the road faster.', 'Fast Processing',
 'Your financial information is protected with bank-level security, and our services are backed by years of experience.', 'Secure & Reliable',
 '', 'We help you gather and organize all necessary documents for a smooth application process.', 'Documentation Support',
 '', 'Our customer support team is available around the clock to answer your questions and provide assistance.', '24/7 Support',
 '', 'Get expert advice on fleet expansion, route optimization, and business growth strategies.', 'Business Consulting',
 'Ready to get started?', 'Contact our team today to discuss your bus financing needs and discover how we can help you grow your transportation business.',
 'Contact Us', 'Learn More',
 '["Competitive interest rates","Flexible payment terms","Quick approval process","No hidden fees"]',
 '["Maintenance scheduling","Insurance management","Performance tracking","Cost optimization"]'),

(3, 'Contact', 'contact', 'Located in the heart of Lagos business district, our office is easily accessible and ready to welcome you.', 'Contact information and inquiry form', 1, 10,
 '2025-08-12 01:25:38', '2025-08-12 01:25:38',
 'Contact', 'Us', 'Ready to expand your bus fleet? Get in touch with our team today and discover how we can help you grow your transportation business.',
 'Call Now', 'Email', 'I have a bus', '+234 707 857 1856', '+234 809 318 3556', 'customerservices@annhurst-gsl.com',
 NULL, 'Info@annhurst-gsl.com', 'Send us a message', NULL, 'Full Name *', NULL, 'Get in touch', NULL,
 'Visit our office', 'Find Us', 'Frequently asked questions', 'FAQ',
 'You''ll need your business registration documents, financial statements, driver''s license, and proof of income. Our team will provide a complete checklist during your initial consultation.', 'What documents do I need to apply for bus financing?',
 'Typically, we can provide approval within 2-3 business days for complete applications. The entire process from application to funding usually takes 1-2 weeks.', 'How long does the approval process take?',
 'We finance all types of buses including minibuses, coaches, school buses, and luxury buses. We work with both new and used vehicles from reputable manufacturers.', 'What types of buses do you finance?',
 'Yes, we offer refinancing solutions for existing bus loans. This can help you get better rates or more favorable terms. Contact us to discuss your options.', 'Do you offer refinancing options?',
 'Our customer support team is available to help you with urgent inquiries and quick questions about our services.', 'Need immediate assistance?',
 'Send Message', 'Monday - Friday: 8:00 AM - 6:00 PM', 'Saturday: 9:00 AM - 2:00 PM', 'Sunday: Closed', 
 '13 Association Avenue', 'Shangisha, Ketu', 'Lagos, Nigeria',
 'Email Address *', 'Phone Number', 'Company Name', 'Service of Interest', 'Message *',
 NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]'),

(4, 'Home', 'home', 'Investment Success', 'Leading provider of bus financing and fleet management services', 1, 10,
 '2025-08-12 01:25:38', '2025-08-12 01:25:38',
 'Bus Higher Purchase', 'Solutions', 'Annhurst Transport Service Limited provides comprehensive bus financing solutions for transportation businesses. Get your fleet on the road with our flexible higher purchase options.',
 'Explore Services', 'Get Started', '5+', 'Years of excellence', '100%', 'On-Time-Payments', '24/7', 'Customer Support',
 'Everything you need for your bus fleet', 'Why Choose Us',
 'We understand the challenges of running a transportation business. That''s why we''ve designed our services to be flexible, reliable, and tailored to your needs.', 'High Returns',
 'Comprehensive bus financing solutions', 'Our Services',
 'Trusted by transportation businesses', 'Join hundreds of successful companies who have grown their fleet with us',
 NULL, NULL,
 'Our secure financing options ensure you get the best rates while maintaining financial stability for your business.', 'Secure Financing',
 'Fast approval process with minimal documentation requirements. Get your buses on the road in record time.', 'Quick Approval',
 'Our team of transportation finance experts is here to guide you through every step of the process.', 'Expert Support',
 'Flexible higher purchase agreements with competitive interest rates. Own your buses while maintaining cash flow for operations.', 'Higher Purchase',
 'Comprehensive fleet management services including maintenance scheduling, insurance, and operational support.', 'Fleet Management',
 'Buses Financed', '200+', 'Happy Clients', '100+', 'Years Experience', '5+', 'Success Rate', '98%',
 'Bus Investment ROI', 'Customer Satisfaction', '98%',
 NULL, NULL, NULL, NULL, NULL, NULL,
 'Ready to expand your fleet?', 'Get in touch with our team today and discover how we can help you grow your transportation business.',
 'Contact Us', 'Learn More', NULL, NULL);

-- Table: payment
CREATE TABLE payment (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    week DATE,
    coordinator TEXT,
    bus BIGINT,
    p_week TEXT,
    receipt TEXT,
    amount BIGINT,
    sender TEXT,
    payment_day TEXT,
    payment_date DATE,
    pay_type TEXT,
    pay_complete TEXT,
    issue TEXT,
    inspection TEXT,
    completed_by TEXT
);

-- Data for payment
INSERT INTO payment VALUES (1, '2025-09-10 19:47:48.320545', '2025-09-08', 'Cleophas', 1, 'First', 'L07,N100000,06.09.2025,DR Receipt.PNG', 100000, 'Elizabeth Mary', 'SAT', '2025-09-06', 'ACCOUNT', 'YES', 'NO', 'YES', 'Cleophas');
INSERT INTO payment VALUES (2, '2025-09-10 21:08:11.150383', '2025-09-08', 'Cleophas', 4, 'First', 'L08,N65000,08.09.2025,DR Receipt.PNG', 65000, 'Taiwo Tola Seun', 'MON', '2025-09-08', 'ACCOUNT', 'YES', 'Bus to be Repossessed', 'YES', 'Cleophas');
INSERT INTO payment VALUES (3, '2025-09-12 17:11:12.749933', '2025-07-21', 'Emmanuel', 3, 'First', 'M01,N65000,20.07.2025,DR Receipt.jpg', 65000, 'OLADAYO SUNDAY ALAO', 'SUN', '2025-07-20', 'ACCOUNT', 'YES', 'N/A - No Issues Collecting Money', 'YES', 'Emmanuel');
INSERT INTO payment VALUES (4, '2025-09-12 17:14:25.893182', '2025-07-28', 'Emmanuel', 3, 'First', 'M01,N28000,29.07.2025,DR Receipt.jpeg', 28000, 'OLADAYO SUNDAY ALAO', 'TUE', '2025-07-29', 'ACCOUNT', 'YES', 'Bus Down', 'YES', 'Emmanuel');
INSERT INTO payment VALUES (5, '2025-09-12 17:17:31.774975', '2025-08-04', 'Emmanuel', 3, 'First', 'M01,N65000,03.08.2025,DR Receipt.pdf', 65000, 'M1 WEEK', 'SUN', '2025-08-03', 'ACCOUNT', 'YES', 'N/A - No Issues Collecting Money', 'YES', 'Emmanuel');
INSERT INTO payment VALUES (6, '2025-09-12 17:20:49.346927', '2025-08-11', 'Emmanuel', 3, 'First', 'M01,N65000,10.09.2025,DR Receipt.pdf', 65000, 'M1 WEEK', 'SUN', '2025-08-10', 'ACCOUNT', 'YES', 'N/A - No Issues Collecting Money', 'YES', 'Emmanuel');
INSERT INTO payment VALUES (7, '2025-09-12 17:24:20.437072', '2025-08-18', 'Emmanuel', 3, 'First', 'M01,N40000,17.08.2025,DR Receipt.pdf', 40000, 'M1 WEEK', 'SUN', '2025-08-17', 'ACCOUNT', 'NO', 'N/A - No Issues Collecting Money', 'YES', 'Emmanuel');
INSERT INTO payment VALUES (8, '2025-09-12 17:25:42.431135', '2025-08-18', 'Emmanuel', 3, 'Second', 'M01,N25000,18.08.2025,DR Receipt.pdf', 25000, 'M1 WEEK', 'MON', '2025-08-18', 'ACCOUNT', 'YES', 'N/A - No Issues Collecting Money', 'YES', 'Emmanuel');
INSERT INTO payment VALUES (9, '2025-09-12 17:41:50.897095', '2025-08-25', 'Emmanuel', 3, 'First', 'M01,N65000,24.08.2025,DR Receipt.pdf', 65000, 'M1 WEEK', 'SUN', '2025-08-24', 'ACCOUNT', 'YES', 'N/A - No Issues Collecting Money', 'YES', 'Emmanuel');
INSERT INTO payment VALUES (10, '2025-09-12 17:44:50.821564', '2025-09-01', 'Emmanuel', 3, 'First', 'M01,N65000,31.08.2025,DR Receipt.jpeg', 65000, 'M1 WEEK', 'SUN', '2025-08-31', 'ACCOUNT', 'YES', 'N/A - No Issues Collecting Money', 'YES', 'Emmanuel');
INSERT INTO payment VALUES (11, '2025-09-12 17:47:09.09852', '2025-09-08', 'Emmanuel', 3, 'First', 'M01,N65000,08.09.2025,DR Receipt.pdf', 65000, 'OLADAYO SUNDAY ALAO', 'SUN', '2025-09-08', 'ACCOUNT', 'YES', 'N/A - No Issues Collecting Money', 'YES', 'Emmanuel');
INSERT INTO payment VALUES (12, '2025-09-29 17:25:55.761494', '2025-09-29', 'Emmanuel', 43, 'First', 'M04,N65000,28.09.2025,DR Receipt.jpeg', 65000, 'OSUOLALE TAIWO BASIRU', 'SUN', '2025-09-28', 'ACCOUNT', 'YES', 'N/A - No Issues Collecting Money', 'YES', 'Emmanuel');
INSERT INTO payment VALUES (13, '2025-09-29 18:44:44.271885', '2025-09-22', 'Emmanuel', 15, 'First', 'K09,N60000,22.09.2025,DR Receipt.pdf', 60000, 'DAMOLA MUMEEN SHOWOBI', 'MON', '2025-09-22', 'ACCOUNT', 'YES', 'N/A - No Issues Collecting Money', 'YES', 'Emmanuel');
INSERT INTO payment VALUES (14, '2025-09-29 19:17:18.184445', '2025-09-29', 'Emmanuel', 49, 'First', 'M10,N65000,29.09.2025,DR Receipt.jpg', 65000, 'EMMANUEL IMOLE OSHATI', 'MON', '2025-09-29', 'ACCOUNT', 'YES', 'N/A - No Issues Collecting Money', 'YES', 'Emmanuel');
INSERT INTO payment VALUES (15, '2025-09-29 19:26:09.226974', '2025-09-29', 'Emmanuel', 23, 'Second', 'K17,N20000,28.09.2025,DR Receipt.jpeg', 20000, 'OLAOYE OLADEJI', 'SUN', '2025-09-28', 'ACCOUNT', 'YES', 'N/A - No Issues Collecting Money', 'YES', 'Emmanuel');
INSERT INTO payment VALUES (16, '2025-11-06 16:28:20.718', '2025-11-03', 'Emmanuel', 21, 'First', 'K15,N50000,06.11.2025,DR Receipt.jpg', 50000, 'God did', 'THU', '2025-11-06', 'ACCOUNT', 'YES', 'N/A - No Issues Collecting Money', 'NO', 'Emmanuel');
INSERT INTO payment VALUES (17, '2025-11-06 17:15:53.628', '2025-11-03', 'Emmanuel', 20, 'First', 'K14,N50000,03.11.2025,DR Receipt.pdf', 50000, 'USER', 'MON', '2025-11-03', 'ACCOUNT', 'YES', 'N/A - No Issues Collecting Money', 'NO', 'Emmanuel');
INSERT INTO payment VALUES (18, '2025-11-27 09:38:48.637', '2025-11-24', 'Emmanuel', 3, 'First', 'M01,N65000,23.11.2025,DR Receipt.jpg', 65000, 'Oladayo sunday', 'SUN', '2025-11-23', 'ACCOUNT', 'YES', 'N/A - No Issues Collecting Money', 'YES', 'Emmanuel');
INSERT INTO payment VALUES (22, '2025-11-27 10:48:58.803', '2025-11-24', 'Emmanuel', 23, 'First', 'K17,N30000,25.11.2025,DR Receipt.jpeg', 30000, 'OLAOYE OLADEJI', 'TUE', '2025-11-25', 'ACCOUNT', 'NO', 'N/A - No Issues Collecting Money', 'YES', 'Emmanuel');

-- Table: settings
CREATE TABLE settings (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    phone JSON,
    email JSON,
    address TEXT,
    logo TEXT,
    footer_write TEXT,
    footer_head TEXT,
    footer_head2 TEXT,
    services JSON,
    bottom_left TEXT,
    bottom_right JSON,
    logo_blk TEXT
);

-- Data for settings
INSERT INTO settings VALUES (1, '2025-11-02 21:57:41.909', '["+234 707 857 1856"]', '["customerservices@annhurst-gsl.com"]', '13 Association Avenue, Shangisha, Ketu\nLagos, Nigeria', 'settings/1759583109440-ats1.png', 'Your trusted partner in bus higher purchase solutions. We provide comprehensive financing options for transportation businesses across the globe.', 'Quick Links', 'Our Services', '["Bus Financing","Higher Purchase","Lease Options","Fleet Management","Insurance Solutions"]', 'Annhurst Transport Service Limited. All rights reserved.', '["Privacy Policy","Terms of Service"]', 'settings/1759582964099-ats.png');

-- Table: subject
CREATE TABLE subject (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    subject TEXT
);

-- Data for subject
INSERT INTO subject VALUES (1, '2025-11-02 21:57:41.902', 'Transaction Complaint');
INSERT INTO subject VALUES (2, '2025-11-02 21:57:41.903', 'Bus Down (Engine Issue)');
INSERT INTO subject VALUES (3, '2025-11-02 21:57:41.905', 'Bus Down (Accident)');
INSERT INTO subject VALUES (4, '2025-11-02 21:57:41.906', 'Bus Down (Gear Issue)');
INSERT INTO subject VALUES (5, '2025-11-02 21:57:41.908', 'Bus Seized (LASTMA/Police)');

-- End of converted dump