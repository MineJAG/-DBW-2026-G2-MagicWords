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

/**
 * Safely invoke a Socket.io acknowledgement callback. Clients may emit without
 * an `ack`, so we no-op when none was provided.
 *
 * @param {Function | undefined} ack - The client's acknowledgement callback.
 * @param {object} payload - Reply body, typically `{ ok, room? , error? }`.
 * @returns {void}
 */
function reply(ack, payload) {
  if (typeof ack === "function") ack(payload);
}

/**
 * Mark every player in a finished room as having finished a game, awarding a
 * win to whoever holds the top score (ties all count as wins; a max of 0
 * counts for no one). Errors per player are logged and swallowed so one
 * failure doesn't poison the rest.
 *
 * @param {object} room
 * @returns {Promise<void>}
 */
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

/**
 * Mark a single player who left/disconnected mid-game as having finished
 * (without a win). Used for the player who walks out, not the rest of the
 * room.
 *
 * @param {object | null | undefined} leftPlayer
 * @returns {Promise<void>}
 */
async function finalizeLeftPlayer(leftPlayer) {
  if (!leftPlayer?.userId) return;
  try {
    await finishGame(leftPlayer.userId, false);
  } catch (err) {
    console.error("Finalize left player error:", err);
  }
}

/**
 * Open a fresh per-match stats slate for every logged-in player in the room.
 * Errors per player are logged and swallowed.
 *
 * @param {object} room
 * @returns {Promise<void>}
 */
async function startAllPlayerStats(room) {
  await Promise.all(
    room.players.map(async (p) => {
      if (!p.userId) return;
      try {
        await startGame(p.userId, { isSingleplayer: room.isSingleplayer });
      } catch (err) {
        console.error("Start stats error:", err);
      }
    })
  );
}

/**
 * Schedule the server-side finish of a room. When `timerEnd` is reached, the
 * room is closed in state, `room:update` + `room:finished` are broadcast, and
 * (multiplayer only) every player's stats are finalized. The room object is
 * captured here, then re-read by code at firing time via the service.
 *
 * @param {object} room - Must include `code` and `timerEnd` (ms timestamp).
 * @returns {void}
 */
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

/**
 * Broadcast the current master word and word-window timestamps to every
 * socket in a room.
 *
 * @param {object} room
 * @returns {void}
 */
function emitWord(room) {
  io.to(room.code).emit("room:word", {
    masterWord: room.masterWord,
    wordStartedAt: room.wordStartedAt,
    nextWordAt: room.nextWordAt,
  });
}

/**
 * Schedule the next master-word rotation. At `nextWordAt`, the room's word is
 * rotated via the service and the result is broadcast to the room; the
 * function then recurses to schedule the following rotation. Skips scheduling
 * when there's no next word or the next rotation would land at/after the
 * room's `timerEnd`.
 *
 * @param {object} room
 * @returns {void}
 */
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

/**
 * Build the Socket.io server, attach it to the given HTTP server, and wire up
 * every `room:*` event handler. Must be called exactly once at boot; later
 * code reaches the same instance via {@link getIO}.
 *
 * Wired events (all emitted by the client and acknowledged via `ack`):
 * - `room:create`, `room:join`, `room:joinRandom`, `room:rejoin`
 * - `room:leave`, `room:kick`
 * - `room:setVisibility`, `room:start`
 * - `disconnect` (Socket.io built-in; we add a grace period before leaving)
 *
 * Server-emitted events: `room:update`, `room:started`, `room:finished`,
 * `room:word`, `room:kicked`.
 *
 * @param {import("http").Server} httpServer
 * @returns {import("socket.io").Server}
 */
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

/**
 * Accessor for the singleton Socket.io server. Throws if {@link initSocket}
 * hasn't run yet — useful for catching boot-order bugs early.
 *
 * @returns {import("socket.io").Server}
 * @throws {Error} If called before `initSocket`.
 */
export function getIO() {
  if (!io) throw new Error("Socket.IO not initialized. Call initSocket(httpServer) first.");
  return io;
}
