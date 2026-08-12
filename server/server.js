import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import imageProxyRouter from "./routes/imageProxy.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// --------------------------------
// Middleware
// --------------------------------

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// --------------------------------
// Routes
// --------------------------------

app.use(
  "/api",
  imageProxyRouter
);

// --------------------------------
// Health check
// --------------------------------

app.get("/", (req, res) => {
  res.json({
    message: "PixelPick AI server is running 🚀",
  });
});

// --------------------------------
// Start server
// --------------------------------

app.listen(PORT, () => {
  console.log(
    `🚀 PixelPick AI server running on port ${PORT}`
  );
});