import pool from "./database";

const initDb = async () => {
  try {
    console.log("Initializing GREENPULSE database...");

    // ============================================
    // 1. USERS
    // ============================================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        role VARCHAR(30) NOT NULL DEFAULT 'citizen',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ============================================
    // 2. PARKS
    // ============================================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS parks (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        location VARCHAR(255),
        area_acres DECIMAL(10,2),
        status VARCHAR(30) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Columns required by parkRoutes
    await pool.query(`
      ALTER TABLE parks
        ADD COLUMN IF NOT EXISTS area_sq_m DECIMAL(12,2),
        ADD COLUMN IF NOT EXISTS city VARCHAR(100),
        ADD COLUMN IF NOT EXISTS condition VARCHAR(50),
        ADD COLUMN IF NOT EXISTS irrigation_status VARCHAR(50);
    `);

    // ============================================
    // 3. TREES
    // ============================================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS trees (
        id SERIAL PRIMARY KEY,
        park_id INTEGER REFERENCES parks(id) ON DELETE CASCADE,
        species VARCHAR(100) NOT NULL,
        latitude DECIMAL(10,7),
        longitude DECIMAL(10,7),
        health_status VARCHAR(30) DEFAULT 'healthy',
        planted_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Columns required by treeRoutes
    await pool.query(`
      ALTER TABLE trees
        ADD COLUMN IF NOT EXISTS age_years INTEGER,
        ADD COLUMN IF NOT EXISTS health_score DECIMAL(5,2),
        ADD COLUMN IF NOT EXISTS risk_level VARCHAR(30),
        ADD COLUMN IF NOT EXISTS canopy_condition VARCHAR(50),
        ADD COLUMN IF NOT EXISTS water_status VARCHAR(50),
        ADD COLUMN IF NOT EXISTS pest_detected BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS disease_detected BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS last_inspection DATE;
    `);

    // ============================================
    // 4. MAINTENANCE TASKS
    // ============================================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS maintenance_tasks (
        id SERIAL PRIMARY KEY,
        park_id INTEGER REFERENCES parks(id) ON DELETE CASCADE,
        task_type VARCHAR(100) NOT NULL,
        description TEXT,
        status VARCHAR(30) DEFAULT 'Pending',
        scheduled_date DATE,
        completed_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Columns required by maintenanceRoutes
    await pool.query(`
      ALTER TABLE maintenance_tasks
        ADD COLUMN IF NOT EXISTS tree_id INTEGER REFERENCES trees(id) ON DELETE CASCADE,
        ADD COLUMN IF NOT EXISTS priority VARCHAR(30) DEFAULT 'Medium',
        ADD COLUMN IF NOT EXISTS due_date DATE,
        ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP;
    `);

    // ============================================
    // 5. CITIZEN REPORTS
    // ============================================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS citizen_reports (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        park_id INTEGER REFERENCES parks(id) ON DELETE SET NULL,
        report_type VARCHAR(100) NOT NULL,
        description TEXT,
        status VARCHAR(30) DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Columns required by reportRoutes
    await pool.query(`
      ALTER TABLE citizen_reports
        ADD COLUMN IF NOT EXISTS location VARCHAR(255),
        ADD COLUMN IF NOT EXISTS latitude DECIMAL(10,7),
        ADD COLUMN IF NOT EXISTS longitude DECIMAL(10,7),
        ADD COLUMN IF NOT EXISTS priority VARCHAR(30) DEFAULT 'Medium';
    `);

    // ============================================
    // 6. ENVIRONMENTAL INDICATORS
    // ============================================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS environmental_indicators (
        id SERIAL PRIMARY KEY,
        park_id INTEGER REFERENCES parks(id) ON DELETE CASCADE,
        temperature DECIMAL(5,2),
        air_quality_index DECIMAL(6,2),
        humidity DECIMAL(5,2),
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Columns required by environmentRoutes
    await pool.query(`
      ALTER TABLE environmental_indicators
        ADD COLUMN IF NOT EXISTS area VARCHAR(150),
        ADD COLUMN IF NOT EXISTS temperature_c DECIMAL(5,2),
        ADD COLUMN IF NOT EXISTS green_coverage_percent DECIMAL(5,2),
        ADD COLUMN IF NOT EXISTS water_availability VARCHAR(50),
        ADD COLUMN IF NOT EXISTS recorded_date DATE;
    `);

    // ============================================
    // INDEXES
    // ============================================

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_trees_park_id
      ON trees(park_id);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_trees_health_status
      ON trees(health_status);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_trees_risk_level
      ON trees(risk_level);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_maintenance_status
      ON maintenance_tasks(status);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_reports_status
      ON citizen_reports(status);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_environmental_area
      ON environmental_indicators(area);
    `);

    console.log("GREENPULSE database initialized successfully.");
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
};

export default initDb;
