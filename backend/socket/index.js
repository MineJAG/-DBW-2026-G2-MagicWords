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
  changeRoomWord,
  rejoinRoom,
} from "../services/roomService.js";
import { getPictureByUsername } from "../services/userService.js";

let io = null;

const DISCONNECT_GRACE_MS = 10_000;
const disconnectTimeouts = new Map();

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

function emitWord(room) {
  io.to(room.code).emit("room:word", {
    masterWord: room.masterWord,
    wordStartedAt: room.wordStartedAt,
    nextWordAt: room.nextWordAt,
  });
}

function scheduleRoomWordChange(room) {
  const { code, nextWordAt, timerEnd } = room;
  if (!nextWordAt || (timerEnd && nextWordAt >= timerEnd)) return;

  const delay = Math.max(0, Number(nextWordAt) - Date.now());
  setTimeout(() => {
    const updatedRoom = changeRoomWord({ code, nextWordAt });
    if (!updatedRoom) return;

    io.to(updatedRoom.code).emit("room:update", updatedRoom);
    emitWord(updatedRoom);
    scheduleRoomWordChange(updatedRoom);
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
        scheduleRoomWordChange(room);
        reply(ack, { ok: true, room });
        io.to(room.code).emit("room:update", room);
        io.to(room.code).emit("room:started", room);
        emitWord(room);
      } catch (e) {
        reply(ack, { ok: false, error: e.message });
      }
    });

    socket.on("room:rejoin", (payload = {}, ack) => {
      try {
        const { room, oldSocketId } = rejoinRoom({
          code: payload.code,
          name: payload.name,
          socketId: socket.id,
        });
        const pending = disconnectTimeouts.get(oldSocketId);
        if (pending) {
          clearTimeout(pending);
          disconnectTimeouts.delete(oldSocketId);
        }
        socket.join(room.code);
        reply(ack, { ok: true, room });
        io.to(room.code).emit("room:update", room);
      } catch (e) {
        reply(ack, { ok: false, error: e.message });
      }
    });

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${socket.id} (${reason})`);
      const socketId = socket.id;
      const handle = setTimeout(() => {
        disconnectTimeouts.delete(socketId);
        const current = findRoomBySocketId(socketId);
        if (!current) return;
        const updated = leaveRoom({ code: current.code, socketId });
        if (updated) io.to(updated.code).emit("room:update", updated);
      }, DISCONNECT_GRACE_MS);
      disconnectTimeouts.set(socketId, handle);
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.IO not initialized. Call initSocket(httpServer) first.");
  return io;
}
