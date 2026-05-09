"use strict";

import "dotenv/config";
import http from "http";
import app from "./app.js";
import connectDB from "./config/connect.js";
import { initSocket } from "./backend/socket/index.js";

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connectDB();

    const httpServer = http.createServer(app);
    initSocket(httpServer);

    httpServer.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (e) {
    console.error("Failed to start server:", e);
    process.exit(1);
  }
}

start();
