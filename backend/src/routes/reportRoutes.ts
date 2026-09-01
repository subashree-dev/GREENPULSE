import { Router } from "express";
import pool from "../config/database";

const router = Router();

// GET all citizen reports
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        r.id,
        r.report_type,
        r.description,
        r.location,
        r.latitude,
        r.longitude,
        r.priority,
        r.status,
        r.created_at,
        p.name AS park_name,
        u.name AS reported_by
      FROM citizen_reports r
      JOIN parks p ON r.park_id = p.id
      JOIN users u ON r.user_id = u.id
      ORDER BY
        CASE r.priority
          WHEN 'High' THEN 1
          WHEN 'Medium' THEN 2
          WHEN 'Low' THEN 3
          ELSE 4
        END,
        r.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching citizen reports:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch citizen reports",
    });
  }
});

// POST a new citizen report
router.post("/", async (req, res) => {
  try {
    const {
      user_id,
      park_id,
      report_type,
      description,
      location,
      latitude,
      longitude,
      priority,
    } = req.body;

    if (!user_id || !park_id || !report_type || !description) {
      return res.status(400).json({
        status: "error",
        message: "user_id, park_id, report_type and description are required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO citizen_reports
      (
        user_id,
        park_id,
        report_type,
        description,
        location,
        latitude,
        longitude,
        priority,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Submitted')
      RETURNING *
      `,
      [
        user_id,
        park_id,
        report_type,
        description,
        location || null,
        latitude || null,
        longitude || null,
        priority || "Medium",
      ],
    );

    return res.status(201).json({
      status: "success",
      message: "Citizen report submitted successfully",
      report: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating citizen report:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to create citizen report",
    });
  }
});

export default router;