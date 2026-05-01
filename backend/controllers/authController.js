"use strict";

import bcrypt from "bcrypt";
import User from "../models/User.js";

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

    res.status(201).json({
      //if all goes well
      id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (e) {
    console.error("Register error:", e);
    res.status(500).json({ error: "Server error" });
  }
}
