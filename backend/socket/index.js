"use strict";

import { Server } from "socket.io";
import { createRoom } from "../services/roomService.js";

let io = null;

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${socket.id} (${reason})`);
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.IO not initialized. Call initSocket(httpServer) first.");
  return io;
}
