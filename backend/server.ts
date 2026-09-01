import express from "express";
import cors from "cors";

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

app.listen(PORT, () => {
  console.log(`GREENPULSE API running on http://localhost:${PORT}`);
});
