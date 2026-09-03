import { connectRedis } from "./config/redis";
import express from "express";
import cors from "cors";

import initDb from "./config/initDb";

import parkRoutes from "./routes/parkRoutes";
import treeRoutes from "./routes/treeRoutes";
import maintenanceRoutes from "./routes/maintenanceRoutes";
import reportRoutes from "./routes/reportRoutes";
import environmentRoutes from "./routes/environmentRoutes";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "success",
    message: "GREENPULSE API is running",
  });
});

app.use("/api/parks", parkRoutes);
app.use("/api/trees", treeRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/environment", environmentRoutes);

async function startServer() {
  try {
    await initDb();

    await connectRedis();

    app.listen(PORT, () => {
      console.log(`GREENPULSE API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start GREENPULSE:", error);
    process.exit(1);
  }
}

startServer();
