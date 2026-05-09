"use strict";

import * as User from "../models/User.js";
import { clearAuthCookie, readAuthCookie, setAuthCookie } from "../utils/authCookies.js";

export async function register(req, res) {
  const username = String(req.body.username ?? "").trim();
  const email = String(req.body.email ?? "").trim().toLowerCase();
  const password = String(req.body.password ?? "");

  if (!username) {
    return res
      .status(400)
      .json({ errors: { username: "Username is required." } });
  } else if (username.length < 5 || username.length > 20) {
    return res.status(400).json({
      errors: { username: "Username must be between 5 and 20 characters." },
    });
  } else if (/[^a-zA-Z0-9]/.test(username)) {
    return res.status(400).json({
      errors: { username: "Username cannot contain special characters." },
    });
  }

  if (!email) {
    return res.status(400).json({ errors: { email: "Email is required." } });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res
      .status(400)
      .json({ errors: { email: "Please enter a valid email address." } });
  }

  if (!password) {
    return res
      .status(400)
      .json({ errors: { password: "Password is required." } });
  } else if (password.length < 6 || password.length > 12) {
    return res.status(400).json({
      errors: { password: "Password must be between 6 and 12 characters." },
    });
  } else if (!/\d/.test(password)) {
    return res.status(400).json({
      errors: { password: "Password must include at least one number." },
    });
  }

  try {
    const existing = await User.findByUsernameOrEmail({ username, email });
    if (existing) {
      const errors = {};
      if (existing.username === username)
        errors.username = "Username already taken.";
      if (existing.email === email) errors.email = "Email already taken.";
      return res.status(409).json({ errors });
    }

    const user = await User.createUser({ username, email, password });

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

export async function login(req, res) {
  const usernameOrEmail = String(req.body.usernameOrEmail ?? "").trim();
  const password = String(req.body.password ?? "");

  if (!usernameOrEmail) {
    return res
      .status(400)
      .json({ errors: { usernameOrEmail: "Username or email is required." } });
  } else if (usernameOrEmail.includes("@")) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usernameOrEmail)) {
      return res
        .status(400)
        .json({ errors: { usernameOrEmail: "Please enter a valid email address." } });
    }
  } else if (usernameOrEmail.length < 5 || usernameOrEmail.length > 20) {
    return res
      .status(400)
      .json({ errors: { usernameOrEmail: "Username must be between 5 and 20 characters." } });
  }

  if (!password) {
    return res.status(400).json({ errors: { password: "Password is required." } });
  }

  try {
    const isEmail = usernameOrEmail.includes("@");
    const user = await User.findByLogin(usernameOrEmail);
    if (!user) {
      const message = isEmail ? "Email not found." : "Username not found.";
      return res.status(401).json({ errors: { usernameOrEmail: message } });
    }

    const ok = await User.verifyPassword(user, password);
    if (!ok) {
      return res
        .status(401)
        .json({ errors: { password: "Password does not match." } });
    }

    setAuthCookie(res, user._id);

    res.status(200).json({
      name: user.username,
      picture: user.picture,
      stats: user.stats,
    });
  } catch (e) {
    console.error("Login error:", e);
    res.status(500).json({ error: "Server error" });
  }
}

export async function updateUsername(req, res) {
  const userId = readAuthCookie(req);
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const username = String(req.body.username ?? "").trim();

  if (!username) {
    return res
      .status(400)
      .json({ errors: { username: "Username is required." } });
  } else if (username.length < 5 || username.length > 20) {
    return res.status(400).json({
      errors: { username: "Username must be between 5 and 20 characters." },
    });
  } else if (/[^a-zA-Z0-9]/.test(username)) {
    return res.status(400).json({
      errors: { username: "Username cannot contain special characters." },
    });
  }

  try {
    const current = await User.findById(userId);
    if (!current) {
      return res.status(401).json({ error: "User not found" });
    }
    if (current.username === username) {
      return res.status(400).json({
        errors: { username: "New username must be different from current." },
      });
    }

    const existing = await User.findByUsername(username);
    if (existing) {
      return res
        .status(409)
        .json({ errors: { username: "Username already taken." } });
    }

    const user = await User.updateUsername(userId, username);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    res.status(200).json({
      name: user.username,
      picture: user.picture,
      stats: user.stats,
    });
  } catch (e) {
    console.error("Update username error:", e);
    res.status(500).json({ error: "Server error" });
  }
}

export async function updatePicture(req, res) {
  const userId = readAuthCookie(req);
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const picture = req.body.picture;

  if (picture !== null && typeof picture !== "string") {
    return res
      .status(400)
      .json({ errors: { picture: "Invalid picture format." } });
  }

  if (typeof picture === "string") {
    if (!/^data:image\/(png|jpeg|jpg|gif|webp);base64,/.test(picture)) {
      return res
        .status(400)
        .json({ errors: { picture: "Picture must be an image file." } });
    }
    if (picture.length > 5 * 1024 * 1024) {
      return res
        .status(413)
        .json({ errors: { picture: "Image is too large (max ~5MB)." } });
    }
  }

  try {
    const user = await User.updatePicture(userId, picture);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    res.status(200).json({
      name: user.username,
      picture: user.picture,
      stats: user.stats,
    });
  } catch (e) {
    console.error("Update picture error:", e);
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
