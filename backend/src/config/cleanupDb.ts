import pool from "./database";

const cleanupDb = async () => {
  try {
    console.log("Starting GREENPULSE production database cleanup...");

    // Delete duplicate maintenance tasks first
    await pool.query(`
      DELETE FROM maintenance_tasks
      WHERE id > 8;
    `);

    // Delete duplicate citizen reports.
    // Keep reports 1-5 and the newer report 16.
    await pool.query(`
      DELETE FROM citizen_reports
      WHERE id BETWEEN 6 AND 15;
    `);

    // Delete duplicate environmental indicator records
    await pool.query(`
      DELETE FROM environmental_indicators
      WHERE id > 5;
    `);

    // Delete duplicate trees.
    // Duplicate parks are kept temporarily because trees reference them.
    await pool.query(`
      DELETE FROM trees
      WHERE id > 15;
    `);

    // Delete duplicate parks.
    // Trees belonging to these parks have already been removed.
    await pool.query(`
      DELETE FROM parks
      WHERE id > 5;
    `);

    // Reset sequences
    await pool.query(`
      SELECT setval(
        pg_get_serial_sequence('users', 'id'),
        COALESCE((SELECT MAX(id) FROM users), 1),
        true
      );

      SELECT setval(
        pg_get_serial_sequence('parks', 'id'),
        COALESCE((SELECT MAX(id) FROM parks), 1),
        true
      );

      SELECT setval(
        pg_get_serial_sequence('trees', 'id'),
        COALESCE((SELECT MAX(id) FROM trees), 1),
        true
      );

      SELECT setval(
        pg_get_serial_sequence('maintenance_tasks', 'id'),
        COALESCE((SELECT MAX(id) FROM maintenance_tasks), 1),
        true
      );

      SELECT setval(
        pg_get_serial_sequence('citizen_reports', 'id'),
        COALESCE((SELECT MAX(id) FROM citizen_reports), 1),
        true
      );

      SELECT setval(
        pg_get_serial_sequence('environmental_indicators', 'id'),
        COALESCE((SELECT MAX(id) FROM environmental_indicators), 1),
        true
      );
    `);

    console.log(
      "GREENPULSE production database cleanup completed successfully.",
    );
  } catch (error) {
    console.error("Database cleanup failed:", error);
    throw error;
  } finally {
    await pool.end();
  }
};

cleanupDb();
