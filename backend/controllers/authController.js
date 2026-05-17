"use strict";

import * as userService from "../services/userService.js";
import { issueAuth, revokeAuth } from "./cookieController.js";

/**
 * Send back a clean error response. If the error has a `status` (thrown by
 * a service), it uses that. Otherwise it logs the error and sends a 500.
 *
 * @param {import("express").Response} res
 * @param {Error & { status?: number, errors?: object }} e
 * @returns {import("express").Response}
 */
function sendError(res, e) {
  if (e.status) {
    return res.status(e.status).json(e.errors ? { errors: e.errors } : { error: e.message });
  }
  console.error("Server error:", e);
  return res.status(500).json({ error: "Server error" });
}

/**
 * Build a `{ field: message }` errors object out of `[field, message]` pairs.
 * Returns `null` when there are no errors, so callers can do `if (errors)`.
 *
 * @param {...[string, string | null | undefined]} fields
 * @returns {Object<string, string> | null}
 */
function fieldErrors(...fields) {
  const errors = {};
  for (const [key, message] of fields) {
    if (message) errors[key] = message;
  }
  return Object.keys(errors).length ? errors : null;
}

/**
 * Sign up a new user. Checks the username, email, and password first.
 * On success, sets the auth cookie and returns the user view with status 201.
 *
 * @param {import("express").Request} req - Body: `{ username, email, password }`.
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export async function register(req, res) {
  const username = String(req.body.username ?? "").trim();
  const email = String(req.body.email ?? "").trim().toLowerCase();
  const password = String(req.body.password ?? "");

  const errors = fieldErrors(
    ["username", userService.validateUsername(username)],
    ["email", userService.validateEmail(email)],
    ["password", userService.validatePassword(password)],
  );
  if (errors) return res.status(400).json({ errors });

  try {
    const { user, view } = await userService.register({ username, email, password });
    issueAuth(res, user._id);
    res.status(201).json(view);
  } catch (e) {
    sendError(res, e);
  }
}

/**
 * Log a user in with either their username or email plus a password.
 * On success, sets the auth cookie and returns the user view with status 200.
 *
 * @param {import("express").Request} req - Body: `{ usernameOrEmail, password }`.
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export async function login(req, res) {
  const usernameOrEmail = String(req.body.usernameOrEmail ?? "").trim();
  const password = String(req.body.password ?? "");

  const errors = fieldErrors(
    ["usernameOrEmail", userService.validateUsernameOrEmail(usernameOrEmail)],
    ["password", password ? null : "Password is required."],
  );
  if (errors) return res.status(400).json({ errors });

  try {
    const { user, view } = await userService.login({ usernameOrEmail, password });
    issueAuth(res, user._id);
    res.status(200).json(view);
  } catch (e) {
    sendError(res, e);
  }
}

/**
 * Change the logged-in user's username. Validates the new name first.
 * Requires auth: `req.userId` is set by the auth middleware.
 *
 * @param {import("express").Request} req - Body: `{ username }`.
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export async function updateUsername(req, res) {
  const username = String(req.body.username ?? "").trim();

  const message = userService.validateUsername(username);
  if (message) return res.status(400).json({ errors: { username: message } });

  try {
    const view = await userService.changeUsername(req.userId, username);
    res.status(200).json(view);
  } catch (e) {
    sendError(res, e);
  }
}

/**
 * Update the logged-in user's profile picture. Returns 413 if the image is
 * too big, 400 for other validation errors. Requires auth.
 *
 * @param {import("express").Request} req - Body: `{ picture }` (data URL).
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export async function updatePicture(req, res) {
  const picture = req.body.picture;

  const message = userService.validatePicture(picture);
  if (message) {
    const status = message.includes("too large") ? 413 : 400;
    return res.status(status).json({ errors: { picture: message } });
  }

  try {
    const view = await userService.changePicture(req.userId, picture);
    res.status(200).json(view);
  } catch (e) {
    sendError(res, e);
  }
}

/**
 * Log the user out by clearing the auth cookie. Always returns 200.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export async function logout(req, res) {
  revokeAuth(res);
  res.status(200).json({ ok: true });
}

/**
 * Return the logged-in user's profile (the "who am I?" call the frontend
 * makes on startup). Requires auth.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export async function me(req, res) {
  try {
    const view = await userService.getProfile(req.userId);
    res.status(200).json(view);
  } catch (e) {
    sendError(res, e);
  }
}
