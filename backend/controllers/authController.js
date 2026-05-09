"use strict";

import * as userService from "../services/userService.js";
import { clearAuthCookie, readAuthCookie, setAuthCookie } from "../utils/authCookies.js";

function sendError(res, e) {
  if (e.status) {
    return res.status(e.status).json(e.errors ? { errors: e.errors } : { error: e.message });
  }
  console.error("Server error:", e);
  return res.status(500).json({ error: "Server error" });
}

function fieldErrors(...fields) {
  const errors = {};
  for (const [key, message] of fields) {
    if (message) errors[key] = message;
  }
  return Object.keys(errors).length ? errors : null;
}

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
    setAuthCookie(res, user._id);
    res.status(201).json(view);
  } catch (e) {
    sendError(res, e);
  }
}

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
    setAuthCookie(res, user._id);
    res.status(200).json(view);
  } catch (e) {
    sendError(res, e);
  }
}

export async function updateUsername(req, res) {
  const userId = readAuthCookie(req);
  if (!userId) return res.status(401).json({ error: "Not authenticated" });

  const username = String(req.body.username ?? "").trim();

  const message = userService.validateUsername(username);
  if (message) return res.status(400).json({ errors: { username: message } });

  try {
    const view = await userService.changeUsername(userId, username);
    res.status(200).json(view);
  } catch (e) {
    sendError(res, e);
  }
}

export async function updatePicture(req, res) {
  const userId = readAuthCookie(req);
  if (!userId) return res.status(401).json({ error: "Not authenticated" });

  const picture = req.body.picture;

  const message = userService.validatePicture(picture);
  if (message) {
    const status = message.includes("too large") ? 413 : 400;
    return res.status(status).json({ errors: { picture: message } });
  }

  try {
    const view = await userService.changePicture(userId, picture);
    res.status(200).json(view);
  } catch (e) {
    sendError(res, e);
  }
}

export async function logout(req, res) {
  clearAuthCookie(res);
  res.status(200).json({ ok: true });
}

export async function me(req, res) {
  const userId = readAuthCookie(req);
  if (!userId) return res.status(401).json({ error: "Not authenticated" });

  try {
    const view = await userService.getProfile(userId);
    res.status(200).json(view);
  } catch (e) {
    sendError(res, e);
  }
}
