"use strict";

import { Server } from "socket.io";
import {
  createRoom,
  joinRoom,
  leaveRoom,
  kickPlayer,
  findRoomBySocketId,
  startRoom,
  finishRoom,
} from "../services/roomService.js";
import { getPictureByUsername } from "../services/userService.js";

let io = null;

function reply(ack, payload) {
  if (typeof ack === "function") ack(payload);
}

function scheduleRoomFinish(room) {
  const { code, timerEnd } = room;

  const delay = Math.max(0, Number(timerEnd ?? 0) - Date.now());
  setTimeout(() => {
    const finishedRoom = finishRoom({ code, timerEnd });
    if (!finishedRoom) return;

    io.to(finishedRoom.code).emit("room:update", finishedRoom);
    io.to(finishedRoom.code).emit("room:finished", finishedRoom);
  }, delay);
}

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("room:create", async (payload = {}, ack) => {
      try {
        const name = payload.name;
        const picture = await getPictureByUsername(name);
        const room = createRoom({ socketId: socket.id, name, picture });
        socket.join(room.code);
        reply(ack, { ok: true, room });
        io.to(room.code).emit("room:update", room);
      } catch (e) {
        reply(ack, { ok: false, error: e.message });
      }
    });

    socket.on("room:join", async (payload = {}, ack) => {
      try {
        const name = payload.name;
        const picture = await getPictureByUsername(name);
        const room = joinRoom({
          code: payload.code,
          socketId: socket.id,
          name,
          picture,
        });
        socket.join(room.code);
        reply(ack, { ok: true, room });
        io.to(room.code).emit("room:update", room);
      } catch (e) {
        reply(ack, { ok: false, error: e.message });
      }
    });

    socket.on("room:leave", (payload = {}, ack) => {
      const code = String(payload.code ?? "").trim();
      const room = leaveRoom({ code, socketId: socket.id });
      if (code) socket.leave(code);
      reply(ack, { ok: true });
      if (room) io.to(room.code).emit("room:update", room);
    });

    socket.on("room:kick", (payload = {}, ack) => {
      try {
        const targetSocketId = String(payload.targetSocketId ?? "").trim();
        const room = kickPlayer({
          code: payload.code,
          hostSocketId: socket.id,
          targetSocketId,
        });
        const targetSocket = io.sockets.sockets.get(targetSocketId);

        targetSocket?.leave(room.code);
        io.to(targetSocketId).emit("room:kicked", { code: room.code });
        reply(ack, { ok: true, room });
        io.to(room.code).emit("room:update", room);
      } catch (e) {
        reply(ack, { ok: false, error: e.message });
      }
    });

    socket.on("room:start", (payload = {}, ack) => {
      try {
        const room = startRoom({
          code: payload.code,
          socketId: socket.id,
          timeLimit: payload.timeLimit,
        });
        scheduleRoomFinish(room);
        reply(ack, { ok: true, room });
        io.to(room.code).emit("room:update", room);
        io.to(room.code).emit("room:started", room);
      } catch (e) {
        reply(ack, { ok: false, error: e.message });
      }
    });

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${socket.id} (${reason})`);
      const current = findRoomBySocketId(socket.id);
      if (!current) return;
      const updated = leaveRoom({ code: current.code, socketId: socket.id });
      if (updated) io.to(updated.code).emit("room:update", updated);
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.IO not initialized. Call initSocket(httpServer) first.");
  return io;
}
