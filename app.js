"use strict";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./backend/routes/authRoutes.js";
import wordRoutes from "./backend/routes/wordRoutes.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use("/api/auth", authRoutes);
app.use("/api/words", wordRoutes);

app.get("/api", (req, res) => {
  res.json({ message: "API working" });
});

export default app;