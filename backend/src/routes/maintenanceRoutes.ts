import { Router } from "express";
import pool from "../config/database";

const router = Router();

// GET all maintenance tasks
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        m.id,
        m.task_type,
        m.priority,
        m.status,
        m.description,
        m.due_date,
        m.completed_at,
        p.name AS park_name,
        t.species AS tree_species,
        t.health_score,
        t.risk_level
      FROM maintenance_tasks m
      JOIN parks p ON m.park_id = p.id
      JOIN trees t ON m.tree_id = t.id
      ORDER BY
        CASE m.priority
          WHEN 'High' THEN 1
          WHEN 'Medium' THEN 2
          WHEN 'Low' THEN 3
          ELSE 4
        END,
        m.due_date
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching maintenance tasks:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch maintenance tasks",
    });
  }
});

// UPDATE maintenance task status
router.patch("/:id/status", async (req, res) => {
  try {
    const taskId = Number(req.params.id);
    const { status } = req.body;

    const allowedStatuses = ["Pending", "In Progress", "Completed"];

    if (!Number.isInteger(taskId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid maintenance task ID",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        status: "error",
        message: "Status must be Pending, In Progress or Completed",
      });
    }

    const completedAt = status === "Completed" ? new Date() : null;

    const result = await pool.query(
      `
      UPDATE maintenance_tasks
      SET
        status = $1,
        completed_at = $2
      WHERE id = $3
      RETURNING *
      `,
      [status, completedAt, taskId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Maintenance task not found",
      });
    }

    return res.json({
      status: "success",
      message: "Maintenance task updated successfully",
      task: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating maintenance task:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to update maintenance task",
    });
  }
});

export default router;