import pool from "./database";

const initDb = async () => {
  try {
    console.log("Initializing GREENPULSE database...");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        role VARCHAR(30) NOT NULL DEFAULT 'citizen',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS parks (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        location VARCHAR(255),
        area_acres DECIMAL(10,2),
        status VARCHAR(30) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

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

      CREATE TABLE IF NOT EXISTS environmental_indicators (
        id SERIAL PRIMARY KEY,
        park_id INTEGER REFERENCES parks(id) ON DELETE CASCADE,
        temperature DECIMAL(5,2),
        air_quality_index DECIMAL(6,2),
        humidity DECIMAL(5,2),
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS maintenance_tasks (
        id SERIAL PRIMARY KEY,
        park_id INTEGER REFERENCES parks(id) ON DELETE CASCADE,
        task_type VARCHAR(100) NOT NULL,
        description TEXT,
        status VARCHAR(30) DEFAULT 'pending',
        scheduled_date DATE,
        completed_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

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

    console.log("GREENPULSE database initialized successfully.");
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
};

export default initDb;
