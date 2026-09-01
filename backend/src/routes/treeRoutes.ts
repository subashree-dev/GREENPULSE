import { Router } from "express";
import pool from "../config/database";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        t.id,
        t.species,
        t.latitude,
        t.longitude,
        t.age_years,
        t.health_score,
        t.health_status,
        t.risk_level,
        t.canopy_condition,
        t.water_status,
        t.pest_detected,
        t.disease_detected,
        t.last_inspection,
        p.name AS park_name,
        p.location AS park_location
      FROM trees t
      JOIN parks p ON t.park_id = p.id
      ORDER BY t.id
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching trees:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch trees",
    });
  }
});

export default router;
