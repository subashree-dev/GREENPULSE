-- ============================================
-- GREENPULSE DATABASE SCHEMA
-- ============================================

-- 1. USERS
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'citizen',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. PARKS
CREATE TABLE IF NOT EXISTS parks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    area_sq_m NUMERIC(12,2),
    location VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    condition VARCHAR(30) DEFAULT 'Good',
    irrigation_status VARCHAR(30) DEFAULT 'Working',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TREES
CREATE TABLE IF NOT EXISTS trees (
    id SERIAL PRIMARY KEY,
    park_id INTEGER REFERENCES parks(id) ON DELETE SET NULL,
    species VARCHAR(100) NOT NULL,
    latitude NUMERIC(10,7),
    longitude NUMERIC(10,7),
    age_years INTEGER,
    health_score INTEGER CHECK (health_score BETWEEN 0 AND 100),
    health_status VARCHAR(30) DEFAULT 'Healthy',
    risk_level VARCHAR(30) DEFAULT 'Low',
    canopy_condition VARCHAR(30),
    water_status VARCHAR(30),
    pest_detected BOOLEAN DEFAULT FALSE,
    disease_detected BOOLEAN DEFAULT FALSE,
    last_inspection DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. MAINTENANCE TASKS
CREATE TABLE IF NOT EXISTS maintenance_tasks (
    id SERIAL PRIMARY KEY,
    tree_id INTEGER REFERENCES trees(id) ON DELETE SET NULL,
    park_id INTEGER REFERENCES parks(id) ON DELETE SET NULL,
    assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
    task_type VARCHAR(100) NOT NULL,
    priority VARCHAR(30) DEFAULT 'Medium',
    status VARCHAR(30) DEFAULT 'Pending',
    description TEXT,
    due_date DATE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. CITIZEN REPORTS
CREATE TABLE IF NOT EXISTS citizen_reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    park_id INTEGER REFERENCES parks(id) ON DELETE SET NULL,
    report_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255),
    latitude NUMERIC(10,7),
    longitude NUMERIC(10,7),
    priority VARCHAR(30) DEFAULT 'Medium',
    status VARCHAR(30) DEFAULT 'Submitted',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. ENVIRONMENTAL INDICATORS
CREATE TABLE IF NOT EXISTS environmental_indicators (
    id SERIAL PRIMARY KEY,
    area VARCHAR(150) NOT NULL,
    temperature_c NUMERIC(5,2),
    air_quality_index INTEGER,
    green_coverage_percent NUMERIC(5,2),
    water_availability VARCHAR(30),
    recorded_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_trees_park_id
ON trees(park_id);

CREATE INDEX IF NOT EXISTS idx_trees_health_status
ON trees(health_status);

CREATE INDEX IF NOT EXISTS idx_trees_risk_level
ON trees(risk_level);

CREATE INDEX IF NOT EXISTS idx_maintenance_status
ON maintenance_tasks(status);

CREATE INDEX IF NOT EXISTS idx_reports_status
ON citizen_reports(status);

CREATE INDEX IF NOT EXISTS idx_environmental_area
ON environmental_indicators(area);