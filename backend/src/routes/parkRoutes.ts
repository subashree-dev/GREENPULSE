import { Router } from "express";
import pool from "../config/database";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        id,
        name,
        area_sq_m,
        location,
        city,
        condition,
        irrigation_status,
        created_at
       FROM parks
       ORDER BY id`,
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching parks:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch parks",
    });
  }
});

export default router;
