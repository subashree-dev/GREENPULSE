import { Router } from "express";
import pool from "../config/database";
import redisClient from "../config/redis";

const router = Router();

const CACHE_KEY = "environmental_indicators";
const CACHE_TTL = 60;

router.get("/", async (_req, res) => {
  try {
    const client = redisClient;

    if (client && client.isOpen) {
      const cachedData = await client.get(CACHE_KEY);

      if (cachedData) {
        console.log("Environment data served from Redis");
        return res.json(JSON.parse(cachedData));
      }
    }

    const result = await pool.query(`
      SELECT
        id,
        area,
        temperature_c,
        air_quality_index,
        green_coverage_percent,
        water_availability,
        recorded_date
      FROM environmental_indicators
      ORDER BY recorded_date DESC, id
    `);

    if (client && client.isOpen) {
      await client.setEx(
        CACHE_KEY,
        CACHE_TTL,
        JSON.stringify(result.rows),
      );

      console.log(
        "Environment data loaded from PostgreSQL and cached in Redis",
      );
    } else {
      console.log("Environment data loaded from PostgreSQL");
    }

    return res.json(result.rows);
  } catch (error) {
    console.error("Error fetching environmental indicators:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to fetch environmental indicators",
    });
  }
});

export default router;