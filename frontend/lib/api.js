"use strict";

const BASE_URL = "http://localhost:3000/api";

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
};
