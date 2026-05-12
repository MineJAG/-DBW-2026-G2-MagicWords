"use strict";

const KEY = "room:session";

export function saveRoomSession({ code, name }) {
  if (!code || !name) return;
  sessionStorage.setItem(KEY, JSON.stringify({ code, name }));
}

export function loadRoomSession() {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearRoomSession() {
  sessionStorage.removeItem(KEY);
}
