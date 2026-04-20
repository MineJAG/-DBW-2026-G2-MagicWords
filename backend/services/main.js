"use strict";

import "dotenv/config";
import express from "express";
import connectDB from "./connect.js";

const app = express(); 
const PORT = process.env.PORT || 3000;

app.use(express.json()); 

app.get("/api", (req, res) => {
  res.json({ message: "API working" });
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

try {
  await connectDB();
} catch (e) {
  console.error("DB connect failed (server still running):", e);
}
