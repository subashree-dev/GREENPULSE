import pool from "./database";

const seedDb = async () => {
  try {
    console.log("Seeding GREENPULSE database...");

    // USERS
    await pool.query(`
      INSERT INTO users (id, name, email, role)
      VALUES
        (1, 'Arun Kumar', 'arun@greenpulse.com', 'admin'),
        (2, 'Priya Sharma', 'priya@greenpulse.com', 'staff'),
        (3, 'Subashree', 'subashree@greenpulse.com', 'citizen')
      ON CONFLICT (id) DO NOTHING;
    `);

    // PARKS
    await pool.query(`
      INSERT INTO parks
        (name, location, city, area_sq_m, area_acres, condition, irrigation_status)
      VALUES
        ('Anna Nagar Tower Park', 'Anna Nagar', 'Chennai', 101171.00, 25.00, 'Good', 'Adequate'),
        ('Semmozhi Poonga', 'Teynampet', 'Chennai', 80000.00, 19.77, 'Excellent', 'Adequate'),
        ('Guindy National Park', 'Guindy', 'Chennai', 2700000.00, 667.18, 'Good', 'Adequate'),
        ('Madhavaram Botanical Garden', 'Madhavaram', 'Chennai', 160000.00, 39.54, 'Fair', 'Limited'),
        ('Adyar Eco Park', 'Adyar', 'Chennai', 240000.00, 59.30, 'Good', 'Adequate')
      ON CONFLICT DO NOTHING;
    `);

    // TREES
    await pool.query(`
      INSERT INTO trees
        (park_id, species, latitude, longitude, age_years, health_score,
         health_status, risk_level, canopy_condition, water_status,
         pest_detected, disease_detected, last_inspection)
      VALUES
        (1, 'Rain Tree', 13.0850, 80.2100, 18, 86, 'Healthy', 'Low', 'Good', 'Adequate', false, false, '2026-08-20'),
        (1, 'Neem', 13.0860, 80.2110, 12, 74, 'Healthy', 'Low', 'Good', 'Adequate', false, false, '2026-08-18'),
        (1, 'Gulmohar', 13.0870, 80.2120, 22, 58, 'Moderate', 'Medium', 'Fair', 'Adequate', false, false, '2026-08-15'),

        (2, 'Copperpod', 13.0400, 80.2490, 15, 91, 'Healthy', 'Low', 'Excellent', 'Adequate', false, false, '2026-08-22'),
        (2, 'Neem', 13.0410, 80.2500, 10, 79, 'Healthy', 'Low', 'Good', 'Adequate', false, false, '2026-08-21'),
        (2, 'Rain Tree', 13.0420, 80.2510, 25, 63, 'Moderate', 'Medium', 'Fair', 'Adequate', false, false, '2026-08-19'),

        (3, 'Banyan', 13.0060, 80.2200, 40, 88, 'Healthy', 'Low', 'Excellent', 'Adequate', false, false, '2026-08-23'),
        (3, 'Neem', 13.0070, 80.2210, 20, 72, 'Healthy', 'Low', 'Good', 'Adequate', false, false, '2026-08-20'),
        (3, 'Tamarind', 13.0080, 80.2220, 30, 47, 'Poor', 'High', 'Poor', 'Limited', true, false, '2026-08-17'),

        (4, 'Teak', 13.1500, 80.2300, 16, 61, 'Moderate', 'Medium', 'Fair', 'Limited', false, false, '2026-08-16'),
        (4, 'Neem', 13.1510, 80.2310, 11, 54, 'Moderate', 'Medium', 'Fair', 'Limited', false, true, '2026-08-14'),
        (4, 'Pongamia', 13.1520, 80.2320, 19, 43, 'Poor', 'High', 'Poor', 'Limited', true, true, '2026-08-13'),

        (5, 'Rain Tree', 13.0100, 80.2600, 24, 82, 'Healthy', 'Low', 'Good', 'Adequate', false, false, '2026-08-22'),
        (5, 'Neem', 13.0110, 80.2610, 14, 69, 'Moderate', 'Medium', 'Good', 'Adequate', false, false, '2026-08-21'),
        (5, 'Indian Almond', 13.0120, 80.2620, 28, 52, 'Moderate', 'Medium', 'Fair', 'Adequate', false, false, '2026-08-18')
      ON CONFLICT DO NOTHING;
    `);

    // MAINTENANCE TASKS
    await pool.query(`
      INSERT INTO maintenance_tasks
        (park_id, tree_id, task_type, priority, status, description, due_date)
      VALUES
        (1, 3, 'Pruning', 'Medium', 'Pending',
         'Prune weak and overgrown branches to improve tree safety.',
         '2026-09-08'),

        (2, 6, 'Canopy Inspection', 'Medium', 'Pending',
         'Inspect canopy condition and remove damaged branches.',
         '2026-09-10'),

        (3, 9, 'Pest Treatment', 'High', 'In Progress',
         'Treat detected pest activity and inspect surrounding trees.',
         '2026-09-05'),

        (4, 10, 'Irrigation Check', 'Medium', 'Pending',
         'Inspect irrigation coverage and improve water distribution.',
         '2026-09-07'),

        (4, 11, 'Disease Treatment', 'High', 'Pending',
         'Inspect suspected disease and apply appropriate treatment.',
         '2026-09-04'),

        (4, 12, 'Emergency Tree Inspection', 'High', 'Pending',
         'Inspect high-risk tree and surrounding public area immediately.',
         '2026-09-03'),

        (5, 15, 'Pruning', 'Medium', 'Pending',
         'Perform routine pruning and canopy maintenance.',
         '2026-09-12'),

        (5, 14, 'Health Inspection', 'Low', 'Completed',
         'Routine health inspection completed.',
         '2026-08-28')
      ON CONFLICT DO NOTHING;
    `);

    // ENVIRONMENTAL INDICATORS
    await pool.query(`
      INSERT INTO environmental_indicators
        (area, temperature_c, air_quality_index,
         green_coverage_percent, water_availability, recorded_date)
      VALUES
        ('Anna Nagar', 34.2, 118, 72, 'Adequate', '2026-09-01'),
        ('Teynampet', 33.5, 96, 81, 'Adequate', '2026-09-01'),
        ('Guindy', 32.8, 72, 88, 'Adequate', '2026-09-01'),
        ('Madhavaram', 35.1, 142, 54, 'Limited', '2026-09-01'),
        ('Adyar', 33.1, 89, 76, 'Adequate', '2026-09-01')
      ON CONFLICT DO NOTHING;
    `);

    // CITIZEN REPORTS
    await pool.query(`
      INSERT INTO citizen_reports
        (user_id, park_id, report_type, description,
         location, priority, status)
      VALUES
        (3, 1, 'Broken Branch',
         'A large branch appears damaged near the walking pathway.',
         'Anna Nagar', 'High', 'Submitted'),

        (3, 2, 'Irrigation Issue',
         'Some plants near the park entrance appear to be receiving insufficient water.',
         'Teynampet', 'Medium', 'Submitted'),

        (3, 3, 'Pest Issue',
         'Possible pest activity noticed on a mature tree.',
         'Guindy', 'High', 'Submitted'),

        (3, 4, 'Dry Tree',
         'Tree appears stressed and shows signs of water shortage.',
         'Madhavaram', 'High', 'Submitted'),

        (3, 5, 'Park Damage',
         'Minor damage noticed around a green area beside the pathway.',
         'Adyar', 'Low', 'Submitted')
      ON CONFLICT DO NOTHING;
    `);

    // Reset sequences so future inserted IDs remain correct
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

    console.log("GREENPULSE database seeded successfully.");
  } catch (error) {
    console.error("Database seeding failed:", error);
    throw error;
  } finally {
    await pool.end();
  }
};

seedDb();
