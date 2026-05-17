"use strict";

const KEY = "room:session";

/**
 * Remember which room the player is currently in, so a page refresh inside a
 * lobby does not eject them. Stored in `sessionStorage` (cleared when the tab
 * closes). No-ops when either field is missing.
 *
 * @param {{ code: string, name: string }} session - Room code and display name.
 * @returns {void}
 */
export function saveRoomSession({ code, name }) {
  if (!code || !name) return;
  sessionStorage.setItem(KEY, JSON.stringify({ code, name }));
}

/**
 * Read the saved room session, if any. Returns `null` when nothing is stored
 * or the stored value is not valid JSON.
 *
 * @returns {{ code: string, name: string } | null}
 */
export function loadRoomSession() {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Forget the saved room session. Call on leave, kick, or game end.
 *
 * @returns {void}
 */
export function clearRoomSession() {
  sessionStorage.removeItem(KEY);
}
