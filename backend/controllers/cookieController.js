"use strict";

import { AuthCookie } from "../models/cookie.js";

/**
 * Set the auth cookie on the response so the user stays logged in.
 *
 * @param {import("express").Response} res
 * @param {string} userId - The user's id (will be stringified).
 * @returns {void}
 */
export function issueAuth(res, userId) {
  AuthCookie.set(res, String(userId));
}

/**
 * Clear the auth cookie. Used on logout.
 *
 * @param {import("express").Response} res
 * @returns {void}
 */
export function revokeAuth(res) {
  AuthCookie.clear(res);
}

/**
 * Read the user id from the auth cookie on an incoming request.
 *
 * @param {import("express").Request} req
 * @returns {string | null} The user id, or null if there's no cookie.
 */
export function getAuthUserId(req) {
  return AuthCookie.read(req);
}
