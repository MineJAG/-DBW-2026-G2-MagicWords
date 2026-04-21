"use strict";

import express from "express";

const app = express();

app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ message: "API working" });
});

// Later you'll add:
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use(errorHandler);

export default app;