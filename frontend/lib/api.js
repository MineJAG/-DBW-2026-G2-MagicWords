"use strict";

const BASE_URL = "http://localhost:3000/api";

/**
 * Send a JSON request to the backend API. Always includes credentials so the
 * session cookie travels with the call. On a non-2xx response, throws an
 * object the caller can inspect via `.status`, `.message`, and `.errors`.
 *
 * @param {string} path - Path under `/api`, e.g. `"/auth/login"`.
 * @param {{ method?: string, body?: object }} [options]
 * @returns {Promise<object>} The parsed JSON body (or `{}` if empty).
 * @throws {{ status: number, message: string, errors: any }}
 */
async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: options.method || "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  // Try to parse JSON, but don't crash if response is empty
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Throw an object so the caller can read .status and .message
    throw {
      status: response.status, message: data.error, errors: data.errors || "Request failed"
    };
  }
  return data;
}

/**
 * Named helpers for every backend REST endpoint the frontend talks to. Each
 * helper returns the parsed response body, or throws the `request` error
 * object. Components should call these instead of `fetch` directly.
 *
 * @property {(payload: { username: string, email: string, password: string }) => Promise<object>} register - `POST /auth/register`.
 * @property {(payload: { usernameOrEmail: string, password: string }) => Promise<object>} login - `POST /auth/login`.
 * @property {() => Promise<object>} me - `GET /auth/me`, returns the current user.
 * @property {() => Promise<object>} logout - `POST /auth/logout`.
 * @property {(payload: { username: string }) => Promise<object>} updateUsername - `PATCH /auth/username`.
 * @property {(payload: { picture: string | null }) => Promise<object>} updatePicture - `PATCH /auth/picture`.
 * @property {(payload: { word: string }) => Promise<object>} validateWord - `POST /words/validate`.
 * @property {() => Promise<object>} getMasterWord - `GET /words/master`.
 */
export const api = {
  register: (payload) =>
    request("/auth/register", { method: "POST", body: payload }),
  login: (payload) =>
    request("/auth/login", { method: "POST", body: payload }),
  me: () =>
    request("/auth/me"),
  logout: () =>
    request("/auth/logout", { method: "POST" }),
  updateUsername: (payload) =>
    request("/auth/username", { method: "PATCH", body: payload }),
  updatePicture: (payload) =>
    request("/auth/picture", { method: "PATCH", body: payload }),
  validateWord: (payload) =>
    request("/words/validate", { method: "POST", body: payload }),
  getMasterWord: () =>
    request("/words/master"),
};
