import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "success",
    message: "GREENPULSE API is running"
  });
});

app.listen(PORT, () => {
  console.log(`GREENPULSE API running on http://localhost:${PORT}`);
});
