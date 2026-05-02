"use strict";

import bcrypt from "bcrypt";
import User from "../models/User.js";
import { clearAuthCookie, readAuthCookie, setAuthCookie } from "../utils/authCookies.js";

export async function register(req, res) {
  const username = String(req.body.username ?? "").trim();
  const email = String(req.body.email ?? "").trim().toLowerCase();
  const password = String(req.body.password ?? "");

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  } else if (username.length < 5 || username.length > 20) {
    return res.status(400).json({
      error: "Username must be between 5 and 20 characters.",
    });
  } else if (/[^a-zA-Z0-9]/.test(username)) {
    return res.status(400).json({
      error: "Username cannot contain special characters.",
    });
  }

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res
      .status(400)
      .json({ error: "Please enter a valid email address." });
  }

  if (!password) {
    return res.status(400).json({ error: "Password is required." });
  } else if (password.length < 6 || password.length > 12) {
    return res.status(400).json({
      error: "Password must be between 6 and 12 characters.",
    });
  } else if (!/\d/.test(password)) {
    return res.status(400).json({
      error: "Password must include at least one number.",
    });
  }

  try {
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      const errors = {};
      if (existing.username === username)
        errors.username = "Username already taken.";
      if (existing.email === email) errors.email = "Email already taken.";
      return res.status(409).json({ errors });
    }

    const passwordHash = await bcrypt.hash(password, 10); // 10 is the number of salt rounds (Encriptation stuff)
    const user = await User.create({ username, email, passwordHash });

    setAuthCookie(res, user._id);

    res.status(201).json({
      name: user.username,
      picture: user.picture,
      stats: user.stats,
    });
  } catch (e) {
    console.error("Register error:", e);
    res.status(500).json({ error: "Server error" });
  }
}

export async function logout(req, res) {
  clearAuthCookie(res);
  res.status(200).json({ ok: true });
}

export async function me(req, res) {
  const userId = readAuthCookie(req);
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    res.status(200).json({
      name: user.username,
      picture: user.picture,
      stats: user.stats,
    });
  } catch (e) {
    console.error("Me error:", e);
    res.status(500).json({ error: "Server error" });
  }
}