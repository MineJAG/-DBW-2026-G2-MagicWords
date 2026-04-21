"use strict";

import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/connect.js";

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (e) {
    console.error("Failed to start server:", e);
    process.exit(1);
  }
}

start();