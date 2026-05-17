"use strict";

import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000";

/**
 * Shared Socket.io client instance. Import this same object everywhere instead
 * of calling `io()` again so the app reuses one connection.
 *
 * - `withCredentials: true` — the session cookie travels with the handshake,
 *   so the server can identify the user behind the socket.
 * - `autoConnect: false` — the socket only opens when a hook/context calls
 *   `socket.connect()`, keeping unauthenticated pages off the socket.
 *
 * @type {import("socket.io-client").Socket}
 */
export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
});
