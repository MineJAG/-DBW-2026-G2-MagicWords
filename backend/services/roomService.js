"use strict";

const rooms = new Map();
const ROOM_CODE_LENGTH = 4;
const MAX_GENERATION_ATTEMPTS = 1000;

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

export function getRoom(code) {
  return rooms.get(String(code ?? "").trim()) || null;
}

export function findRoomBySocketId(socketId) {
  for (const room of rooms.values()) {
    if (room.players.some((p) => p.socketId === socketId)) return room;
  }
  return null;
}
