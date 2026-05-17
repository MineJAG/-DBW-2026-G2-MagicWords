"use strict";

import { CHANGE_TIME, generateMasterWord } from "./masterWordService.js";

const rooms = new Map();
const ROOM_CODE_LENGTH = 4;
const MAX_GENERATION_ATTEMPTS = 1000;
const DEFAULT_TIME_LIMIT = 600;

export const ROOM_STATUS = Object.freeze({
  WAITING: "waiting",
  PLAYING: "playing",
  FINISHED: "finished",
});

/**
 * Make a unique 4-digit room code that isn't already in use. Gives up after
 * a thousand tries and throws a 500.
 *
 * @returns {string}
 */
function generateRoomCode() {
  const min = 10 ** (ROOM_CODE_LENGTH - 1);
  const max = 10 ** ROOM_CODE_LENGTH;
  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt++) {
    const code = String(Math.floor(min + Math.random() * (max - min)));
    if (!rooms.has(code)) return code;
  }
  const err = new Error("Could not generate a unique room code.");
  err.status = 500;
  throw err;
}

/**
 * Build a fresh player object for a room with score 0.
 *
 * @param {{ socketId: string, name: string, picture?: string | null, userId?: string | null }} params
 * @returns {{ id: string, socketId: string, name: string, picture: string | null, userId: string | null, score: number }}
 */
function buildPlayer({ socketId, name, picture, userId }) {
  return {
    id: socketId,
    socketId,
    name,
    picture: picture ?? null,
    userId: userId ?? null,
    score: 0,
  };
}

/**
 * Strip a player down to the small "host" shape (no score, no userId).
 *
 * @param {object} player
 * @returns {{ id: string, socketId: string, name: string, picture: string | null }}
 */
function buildHost(player) {
  return {
    id: player.id,
    socketId: player.socketId,
    name: player.name,
    picture: player.picture ?? null,
  };
}

/**
 * Make sure a socketId and name were passed in. Throws a 400 if not.
 *
 * @param {{ socketId?: string, name?: string }} params
 * @returns {void}
 */
function requirePlayerInfo({ socketId, name }) {
  if (!socketId) {
    const err = new Error("Socket id is required.");
    err.status = 400;
    throw err;
  }
  if (!name || typeof name !== "string") {
    const err = new Error("Player name is required.");
    err.status = 400;
    throw err;
  }
}

/**
 * Make a new room with the caller as host. The room starts in "waiting"
 * status, is public by default, and uses the default time limit.
 *
 * @param {{ socketId: string, name: string, picture?: string | null, userId?: string | null, isSingleplayer?: boolean }} params
 * @returns {object} The new room.
 */
export function createRoom({ socketId, name, picture, userId, isSingleplayer = false }) {
  requirePlayerInfo({ socketId, name });
  const code = generateRoomCode();
  const hostPlayer = buildPlayer({ socketId, name, picture, userId });
  const room = {
    code,
    isSingleplayer: Boolean(isSingleplayer),
    host: buildHost(hostPlayer),
    status: ROOM_STATUS.WAITING,
    isPublic: true,
    timeLimit: DEFAULT_TIME_LIMIT,
    startedAt: null,
    timerEnd: null,
    masterWord: null,
    wordStartedAt: null,
    nextWordAt: null,
    players: [hostPlayer],
    createdAt: Date.now(),
  };
  rooms.set(code, room);
  return room;
}

/**
 * Add a player to an existing room. Throws 404 if the room isn't there
 * and 409 if the game has already started. If the same socket is already
 * in the room, the room is returned unchanged.
 *
 * @param {{ code: string, socketId: string, name: string, picture?: string | null, userId?: string | null }} params
 * @returns {object} The updated room.
 */
export function joinRoom({ code, socketId, name, picture, userId }) {
  requirePlayerInfo({ socketId, name });
  const normalizedCode = String(code ?? "").trim();
  const room = rooms.get(normalizedCode);
  if (!room) {
    const err = new Error("Room not found.");
    err.status = 404;
    throw err;
  }
  if (room.status !== ROOM_STATUS.WAITING) {
    const err = new Error("Game already started.");
    err.status = 409;
    throw err;
  }
  if (room.players.some((p) => p.socketId === socketId)) return room;
  room.players.push(buildPlayer({ socketId, name, picture, userId }));
  return room;
}

/**
 * Remove a player from a room. If they were the last person, the room is
 * deleted. If they were the host, the next player in the list becomes the
 * new host. Returns info the caller can use to broadcast updates.
 *
 * @param {{ code: string, socketId: string }} params
 * @returns {{ room: object | null, leftPlayer: object | null, wasPlaying: boolean }}
 */
export function leaveRoom({ code, socketId }) {
  const normalizedCode = String(code ?? "").trim();
  const room = rooms.get(normalizedCode);
  if (!room) return { room: null, leftPlayer: null, wasPlaying: false };

  const leftPlayer = room.players.find((p) => p.socketId === socketId) ?? null;
  const wasPlaying = room.status === ROOM_STATUS.PLAYING;

  room.players = room.players.filter((p) => p.socketId !== socketId);
  if (room.players.length === 0) {
    rooms.delete(normalizedCode);
    return { room: null, leftPlayer, wasPlaying };
  }
  if (room.host?.socketId === socketId) {
    room.host = buildHost(room.players[0]);
  }
  return { room, leftPlayer, wasPlaying };
}

/**
 * Kick a player from a room. Only the host can call this, and the host
 * can't kick themselves. Throws 404 (room or player missing), 403 (not
 * host), or 400 (trying to kick host).
 *
 * @param {{ code: string, hostSocketId: string, targetSocketId: string }} params
 * @returns {object} The updated room.
 */
export function kickPlayer({ code, hostSocketId, targetSocketId }) {
  const normalizedCode = String(code ?? "").trim();
  const room = rooms.get(normalizedCode);
  if (!room) {
    const err = new Error("Room not found.");
    err.status = 404;
    throw err;
  }
  if (room.host?.socketId !== hostSocketId) {
    const err = new Error("Only the room host can kick players.");
    err.status = 403;
    throw err;
  }
  if (room.host?.socketId === targetSocketId) {
    const err = new Error("Host cannot be kicked.");
    err.status = 400;
    throw err;
  }
  if (!room.players.some((p) => p.socketId === targetSocketId)) {
    const err = new Error("Player not found in this room.");
    err.status = 404;
    throw err;
  }

  room.players = room.players.filter((p) => p.socketId !== targetSocketId);
  return room;
}

/**
 * Begin the game in a room. Only the host can call this. Picks the first
 * master word, sets the round timer, and flips the status to "playing".
 * If a valid `timeLimit` (>= 60 seconds) is provided, it overrides the
 * default; otherwise the room keeps the time it already has.
 *
 * @param {{ code: string, socketId: string, timeLimit?: number }} params
 * @returns {object} The updated room.
 */
export function startRoom({ code, socketId, timeLimit }) {
  const normalizedCode = String(code ?? "").trim();
  const room = rooms.get(normalizedCode);
  if (!room) {
    const err = new Error("Room not found.");
    err.status = 404;
    throw err;
  }
  if (room.host?.socketId !== socketId) {
    const err = new Error("Only the room host can start the game.");
    err.status = 403;
    throw err;
  }

  const parsedTimeLimit = Number(timeLimit);
  if (Number.isFinite(parsedTimeLimit) && parsedTimeLimit >= 60) {
    room.timeLimit = Math.round(parsedTimeLimit);
  }

  const startedAt = Date.now();
  room.status = ROOM_STATUS.PLAYING;
  room.startedAt = startedAt;
  room.timerEnd = startedAt + room.timeLimit * 1000;
  room.masterWord = generateMasterWord();
  room.wordStartedAt = startedAt;
  room.nextWordAt = startedAt + CHANGE_TIME;
  return room;
}

/**
 * Mark a room as finished. Returns null (no-op) when the room is missing,
 * not currently playing, or the given `timerEnd` doesn't match the room's
 * current `timerEnd` (used to ignore stale "round over" events).
 *
 * @param {{ code: string, timerEnd?: number }} params
 * @returns {object | null}
 */
export function finishRoom({ code, timerEnd }) {
  const normalizedCode = String(code ?? "").trim();
  const room = rooms.get(normalizedCode);
  if (!room) return null;
  if (room.status !== ROOM_STATUS.PLAYING) return null;
  if (timerEnd && room.timerEnd !== timerEnd) return null;

  room.status = ROOM_STATUS.FINISHED;
  return room;
}

/**
 * Swap in a new master word mid-game. Returns null if the room is missing,
 * not playing, the timer has already expired, or the `nextWordAt` doesn't
 * match (so old timers don't trigger a swap).
 *
 * @param {{ code: string, nextWordAt?: number }} params
 * @returns {object | null}
 */
export function changeRoomWord({ code, nextWordAt }) {
  const normalizedCode = String(code ?? "").trim();
  const room = rooms.get(normalizedCode);
  if (!room) return null;
  if (room.status !== ROOM_STATUS.PLAYING) return null;
  if (nextWordAt && room.nextWordAt !== nextWordAt) return null;
  if (room.timerEnd && Date.now() >= room.timerEnd) return null;

  const wordStartedAt = Date.now();
  room.masterWord = generateMasterWord();
  room.wordStartedAt = wordStartedAt;
  room.nextWordAt = wordStartedAt + CHANGE_TIME;
  return room;
}

/**
 * Set a player's score in a room. Looks the player up by `socketId` first,
 * then by `name` if no socketId was passed. Throws 404 if the room or
 * player isn't found. Non-numeric scores are treated as 0.
 *
 * @param {{ code: string, socketId?: string, name?: string, score: number }} params
 * @returns {object} The updated room.
 */
export function updatePlayerScore({ code, socketId, name, score }) {
  const normalizedCode = String(code ?? "").trim();
  const room = rooms.get(normalizedCode);
  if (!room) {
    const err = new Error("Room not found.");
    err.status = 404;
    throw err;
  }

  const player = room.players.find((p) => {
    if (socketId) return p.socketId === socketId;
    if (name) return p.name === name;
    return false;
  });
  if (!player) {
    const err = new Error("Player not found in this room.");
    err.status = 404;
    throw err;
  }

  const parsedScore = Number(score);
  player.score = Number.isFinite(parsedScore) ? parsedScore : 0;
  return room;
}

/**
 * Reattach a player to their old slot in a room after a reconnect. Matches
 * by name, swaps in the new socketId, and keeps host status if they were
 * the host. Returns the room plus the old socketId so the caller can move
 * the socket between socket.io rooms.
 *
 * @param {{ code: string, name: string, socketId: string }} params
 * @returns {{ room: object, oldSocketId: string }}
 */
export function rejoinRoom({ code, name, socketId }) {
  requirePlayerInfo({ socketId, name });
  const normalizedCode = String(code ?? "").trim();
  const room = rooms.get(normalizedCode);
  if (!room) {
    const err = new Error("Room not found.");
    err.status = 404;
    throw err;
  }
  const player = room.players.find((p) => p.name === name);
  if (!player) {
    const err = new Error("Player not in room.");
    err.status = 404;
    throw err;
  }
  const oldSocketId = player.socketId;
  player.socketId = socketId;
  player.id = socketId;
  if (room.host?.socketId === oldSocketId) {
    room.host = buildHost(player);
  }
  return { room, oldSocketId };
}

/**
 * Look up a room by its code. Returns null if none exists.
 *
 * @param {string} code
 * @returns {object | null}
 */
export function getRoom(code) {
  return rooms.get(String(code ?? "").trim()) || null;
}

/**
 * Pick a random public room that's still waiting for players. Used by the
 * "join random" flow. Returns null if there are no joinable rooms.
 *
 * @returns {object | null}
 */
export function findAvailableRoom() {
  const waiting = [];
  for (const r of rooms.values()) {
    if (r.status === ROOM_STATUS.WAITING && r.isPublic !== false) waiting.push(r);
  }
  if (waiting.length === 0) return null;
  return waiting[Math.floor(Math.random() * waiting.length)];
}

/**
 * Toggle a room between public and private. Only the host can call this;
 * non-hosts get a 403, missing rooms a 404.
 *
 * @param {{ code: string, socketId: string, isPublic: boolean }} params
 * @returns {object} The updated room.
 */
export function setRoomVisibility({ code, socketId, isPublic }) {
  const normalizedCode = String(code ?? "").trim();
  const room = rooms.get(normalizedCode);
  if (!room) {
    const err = new Error("Room not found.");
    err.status = 404;
    throw err;
  }
  if (room.host?.socketId !== socketId) {
    const err = new Error("Only the room host can change visibility.");
    err.status = 403;
    throw err;
  }
  room.isPublic = Boolean(isPublic);
  return room;
}

/**
 * Find the room a given socket is currently in (if any). Used on
 * disconnect, so we know which room to clean up. Returns null if the
 * socket isn't in any room.
 *
 * @param {string} socketId
 * @returns {object | null}
 */
export function findRoomBySocketId(socketId) {
  for (const room of rooms.values()) {
    if (room.players.some((p) => p.socketId === socketId)) return room;
  }
  return null;
}
