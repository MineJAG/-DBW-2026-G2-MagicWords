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

function buildPlayer({ socketId, name, picture, isHost }) {
  return {
    id: socketId,
    socketId,
    name,
    picture: picture ?? null,
    score: 0,
    isHost: !!isHost,
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
  const room = {
    code,
    hostSocketId: socketId,
    players: [buildPlayer({ socketId, name, picture, isHost: true })],
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
  room.players.push(buildPlayer({ socketId, name, picture, isHost: false }));
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
  if (room.hostSocketId === socketId) {
    room.hostSocketId = room.players[0].socketId;
    room.players[0].isHost = true;
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
