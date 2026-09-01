-- ============================================
-- GREENPULSE DEMO SEED DATA
-- Chennai-focused hybrid dataset
-- ============================================

-- Clear existing demo data safely
TRUNCATE TABLE
    citizen_reports,
    maintenance_tasks,
    trees,
    environmental_indicators,
    parks,
    users
RESTART IDENTITY CASCADE;


-- ============================================
-- 1. USERS
-- ============================================

INSERT INTO users (name, email, role) VALUES
('GREENPULSE Admin', 'admin@greenpulse.local', 'admin'),
('Chennai Field Team', 'field@greenpulse.local', 'field_worker'),
('Demo Citizen', 'citizen@greenpulse.local', 'citizen');


-- ============================================
-- 2. PARKS
-- ============================================

INSERT INTO parks
(name, area_sq_m, location, city, condition, irrigation_status)
VALUES
('Anna Nagar Tower Park', 12000, 'Anna Nagar', 'Chennai', 'Good', 'Working'),
('Semmozhi Poonga', 20000, 'Teynampet', 'Chennai', 'Good', 'Working'),
('Nageswara Rao Park', 7000, 'Mylapore', 'Chennai', 'Fair', 'Needs Inspection'),
('Adyar Eco Park', 24000, 'Adyar', 'Chennai', 'Good', 'Working'),
('Madhavaram Botanical Garden', 16000, 'Madhavaram', 'Chennai', 'Fair', 'Needs Inspection');


-- ============================================
-- 3. TREES
-- ============================================

INSERT INTO trees
(park_id, species, latitude, longitude, age_years,
 health_score, health_status, risk_level,
 canopy_condition, water_status,
 pest_detected, disease_detected, last_inspection)
VALUES

-- Anna Nagar Tower Park
(1, 'Neem', 13.0850, 80.2101, 18,
 88, 'Healthy', 'Low',
 'Good', 'Adequate', FALSE, FALSE, '2026-08-20'),

(1, 'Rain Tree', 13.0854, 80.2105, 25,
 72, 'Moderate', 'Medium',
 'Fair', 'Adequate', FALSE, FALSE, '2026-08-18'),

(1, 'Gulmohar', 13.0846, 80.2097, 12,
 45, 'Unhealthy', 'High',
 'Poor', 'Low', TRUE, FALSE, '2026-08-15'),

(1, 'Peepal', 13.0858, 80.2110, 30,
 61, 'Moderate', 'Medium',
 'Fair', 'Adequate', FALSE, FALSE, '2026-08-17'),

-- Semmozhi Poonga
(2, 'Neem', 13.0535, 80.2510, 20,
 91, 'Healthy', 'Low',
 'Excellent', 'Adequate', FALSE, FALSE, '2026-08-22'),

(2, 'Mango', 13.0539, 80.2506, 15,
 78, 'Healthy', 'Low',
 'Good', 'Adequate', FALSE, FALSE, '2026-08-21'),

(2, 'Rain Tree', 13.0531, 80.2515, 28,
 52, 'Unhealthy', 'High',
 'Poor', 'Low', TRUE, TRUE, '2026-08-16'),

(2, 'Copperpod', 13.0542, 80.2502, 10,
 84, 'Healthy', 'Low',
 'Good', 'Adequate', FALSE, FALSE, '2026-08-23'),

-- Nageswara Rao Park
(3, 'Neem', 13.0338, 80.2676, 16,
 67, 'Moderate', 'Medium',
 'Fair', 'Adequate', FALSE, FALSE, '2026-08-19'),

(3, 'Banyan', 13.0342, 80.2679, 35,
 39, 'Unhealthy', 'High',
 'Poor', 'Low', FALSE, TRUE, '2026-08-14'),

(3, 'Ashoka', 13.0335, 80.2672, 9,
 86, 'Healthy', 'Low',
 'Good', 'Adequate', FALSE, FALSE, '2026-08-22'),

-- Adyar Eco Park
(4, 'Pongamia', 13.0067, 80.2563, 22,
 82, 'Healthy', 'Low',
 'Good', 'Adequate', FALSE, FALSE, '2026-08-24'),

(4, 'Neem', 13.0071, 80.2568, 14,
 74, 'Moderate', 'Medium',
 'Fair', 'Adequate', FALSE, FALSE, '2026-08-20'),

(4, 'Rain Tree', 13.0063, 80.2559, 31,
 48, 'Unhealthy', 'High',
 'Poor', 'Low', TRUE, FALSE, '2026-08-13'),

-- Madhavaram Botanical Garden
(5, 'Teak', 13.1474, 80.2308, 19,
 76, 'Healthy', 'Low',
 'Good', 'Adequate', FALSE, FALSE, '2026-08-21'),

(5, 'Neem', 13.1479, 80.2312, 23,
 58, 'Moderate', 'Medium',
 'Fair', 'Low', FALSE, FALSE, '2026-08-17'),

(5, 'Mango', 13.1471, 80.2303, 11,
 43, 'Unhealthy', 'High',
 'Poor', 'Low', TRUE, TRUE, '2026-08-12');


-- ============================================
-- 4. MAINTENANCE TASKS
-- ============================================

INSERT INTO maintenance_tasks
(tree_id, park_id, assigned_to, task_type, priority,
 status, description, due_date)
VALUES

(3, 1, 2, 'Pest Control', 'High',
 'Pending',
 'Inspect Gulmohar tree and treat detected pest activity.',
 '2026-09-01'),

(7, 2, 2, 'Disease Inspection', 'High',
 'In Progress',
 'Inspect Rain Tree for signs of disease and canopy decline.',
 '2026-09-01'),

(10, 3, 2, 'Tree Health Inspection', 'High',
 'Pending',
 'Detailed inspection required for unhealthy Banyan tree.',
 '2026-09-02'),

(14, 4, 2, 'Irrigation', 'Medium',
 'Pending',
 'Increase water availability and monitor tree condition.',
 '2026-09-03'),

(17, 5, 2, 'Pest Control', 'High',
 'Pending',
 'Inspect Mango tree and perform pest treatment.',
 '2026-09-01');


-- ============================================
-- 5. CITIZEN REPORTS
-- ============================================

INSERT INTO citizen_reports
(user_id, park_id, report_type, description,
 location, latitude, longitude, priority, status)
VALUES

(3, 1, 'Broken Branch',
 'Large branch appears damaged near the walking path.',
 'Anna Nagar Tower Park',
 13.0852, 80.2103,
 'High', 'Submitted'),

(3, 3, 'Dry Tree',
 'Tree near the park entrance appears severely dry.',
 'Nageswara Rao Park',
 13.0340, 80.2677,
 'High', 'Under Review'),

(3, 5, 'Irrigation Issue',
 'Plants and trees in one section appear to have insufficient water.',
 'Madhavaram Botanical Garden',
 13.1476, 80.2309,
 'Medium', 'Submitted');


-- ============================================
-- 6. ENVIRONMENTAL INDICATORS
-- ============================================

INSERT INTO environmental_indicators
(area, temperature_c, air_quality_index,
 green_coverage_percent, water_availability, recorded_date)
VALUES

('Anna Nagar', 34.5, 82, 28.5, 'Moderate', '2026-08-31'),
('Teynampet', 35.2, 91, 24.8, 'Adequate', '2026-08-31'),
('Mylapore', 34.8, 88, 19.6, 'Low', '2026-08-31'),
('Adyar', 33.9, 74, 36.2, 'Adequate', '2026-08-31'),
('Madhavaram', 35.5, 96, 22.4, 'Low', '2026-08-31');