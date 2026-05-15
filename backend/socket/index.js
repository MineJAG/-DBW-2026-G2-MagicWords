"use strict";

import { Server } from "socket.io";
import {
  createRoom,
  joinRoom,
  leaveRoom,
  kickPlayer,
  findRoomBySocketId,
  findAvailableRoom,
  setRoomVisibility,
  startRoom,
  finishRoom,
  changeRoomWord,
  rejoinRoom,
} from "../services/roomService.js";
import { getRoomIdentityByUsername } from "../services/userService.js";
import { startGame, finishGame } from "../services/scoreService.js";

let io = null;

const DISCONNECT_GRACE_MS = 10_000;
const disconnectTimeouts = new Map();

function reply(ack, payload) {
  if (typeof ack === "function") ack(payload);
}

async function finalizeAllPlayerStats(room) {
  const maxScore = room.players.reduce((m, p) => Math.max(m, p.score ?? 0), 0);
  await Promise.all(
    room.players.map(async (p) => {
      if (!p.userId) return;
      try {
        const win = maxScore > 0 && (p.score ?? 0) === maxScore;
        await finishGame(p.userId, win);
      } catch (err) {
        console.error("Finalize stats error:", err);
      }
    })
  );
}

async function finalizeLeftPlayer(leftPlayer) {
  if (!leftPlayer?.userId) return;
  try {
    await finishGame(leftPlayer.userId, false);
  } catch (err) {
    console.error("Finalize left player error:", err);
  }
}

async function startAllPlayerStats(room) {
  await Promise.all(
    room.players.map(async (p) => {
      if (!p.userId) return;
      try {
        await startGame(p.userId);
      } catch (err) {
        console.error("Start stats error:", err);
      }
    })
  );
}

function scheduleRoomFinish(room) {
  const { code, timerEnd } = room;

  const delay = Math.max(0, Number(timerEnd ?? 0) - Date.now());
  setTimeout(async () => {
    const finishedRoom = finishRoom({ code, timerEnd });
    if (!finishedRoom) return;

    io.to(finishedRoom.code).emit("room:update", finishedRoom);
    io.to(finishedRoom.code).emit("room:finished", finishedRoom);

    if (!finishedRoom.isSingleplayer) await finalizeAllPlayerStats(finishedRoom);
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
        const { userId, picture } = await getRoomIdentityByUsername(name);
        const room = createRoom({
          socketId: socket.id,
          name,
          picture,
          userId,
          isSingleplayer: payload.isSingleplayer,
        });
        socket.join(room.code);
        reply(ack, { ok: true, room });
        io.to(room.code).emit("room:update", room);
      } catch (e) {
        reply(ack, { ok: false, error: e.message });
      }
    });

    socket.on("room:joinRandom", async (payload = {}, ack) => {
      try {
        const name = payload.name;
        const { userId, picture } = await getRoomIdentityByUsername(name);
        const available = findAvailableRoom();
        const room = available
          ? joinRoom({
              code: available.code,
              socketId: socket.id,
              name,
              picture,
              userId,
            })
          : createRoom({ socketId: socket.id, name, picture, userId });
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
        const { userId, picture } = await getRoomIdentityByUsername(name);
        const room = joinRoom({
          code: payload.code,
          socketId: socket.id,
          name,
          picture,
          userId,
        });
        socket.join(room.code);
        reply(ack, { ok: true, room });
        io.to(room.code).emit("room:update", room);
      } catch (e) {
        reply(ack, { ok: false, error: e.message });
      }
    });

    socket.on("room:leave", async (payload = {}, ack) => {
      const code = String(payload.code ?? "").trim();
      const current = findRoomBySocketId(socket.id);
      const { room, leftPlayer, wasPlaying } = leaveRoom({ code, socketId: socket.id });
      if (code) socket.leave(code);
      reply(ack, { ok: true });
      if (room) io.to(room.code).emit("room:update", room);
      if (wasPlaying && !current?.isSingleplayer) await finalizeLeftPlayer(leftPlayer);
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

    socket.on("room:setVisibility", (payload = {}, ack) => {
      try {
        const room = setRoomVisibility({
          code: payload.code,
          socketId: socket.id,
          isPublic: payload.isPublic,
        });
        reply(ack, { ok: true, room });
        io.to(room.code).emit("room:update", room);
      } catch (e) {
        reply(ack, { ok: false, error: e.message });
      }
    });

    socket.on("room:start", async (payload = {}, ack) => {
      try {
        const room = startRoom({
          code: payload.code,
          socketId: socket.id,
          timeLimit: payload.timeLimit,
        });
        await startAllPlayerStats(room);
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
      const handle = setTimeout(async () => {
        disconnectTimeouts.delete(socketId);
        const current = findRoomBySocketId(socketId);
        if (!current) return;
        const { room, leftPlayer, wasPlaying } = leaveRoom({ code: current.code, socketId });
        if (room) io.to(room.code).emit("room:update", room);
        if (wasPlaying && !current.isSingleplayer) await finalizeLeftPlayer(leftPlayer);
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
