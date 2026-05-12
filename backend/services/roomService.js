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

function buildPlayer({ socketId, name, picture }) {
  return {
    id: socketId,
    socketId,
    name,
    picture: picture ?? null,
    score: 0,
  };
}

function buildHost(player) {
  return {
    id: player.id,
    socketId: player.socketId,
    name: player.name,
    picture: player.picture ?? null,
  };
}

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

export function createRoom({ socketId, name, picture }) {
  requirePlayerInfo({ socketId, name });
  const code = generateRoomCode();
  const hostPlayer = buildPlayer({ socketId, name, picture });
  const room = {
    code,
    host: buildHost(hostPlayer),
    status: ROOM_STATUS.WAITING,
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

export function joinRoom({ code, socketId, name, picture }) {
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
  room.players.push(buildPlayer({ socketId, name, picture }));
  return room;
}

export function leaveRoom({ code, socketId }) {
  const normalizedCode = String(code ?? "").trim();
  const room = rooms.get(normalizedCode);
  if (!room) return null;

  room.players = room.players.filter((p) => p.socketId !== socketId);
  if (room.players.length === 0) {
    rooms.delete(normalizedCode);
    return null;
  }
  if (room.host?.socketId === socketId) {
    room.host = buildHost(room.players[0]);
  }
  return room;
}

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

export function finishRoom({ code, timerEnd }) {
  const normalizedCode = String(code ?? "").trim();
  const room = rooms.get(normalizedCode);
  if (!room) return null;
  if (room.status !== ROOM_STATUS.PLAYING) return null;
  if (timerEnd && room.timerEnd !== timerEnd) return null;

  room.status = ROOM_STATUS.FINISHED;
  return room;
}

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

export function getRoom(code) {
  return rooms.get(String(code ?? "").trim()) || null;
}

export function findRoomBySocketId(socketId) {
  for (const room of rooms.values()) {
    if (room.players.some((p) => p.socketId === socketId)) return room;
  }
  return null;
}
