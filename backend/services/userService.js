"use strict";

import * as User from "../models/user.js";

const USERNAME_MIN = 5;
const USERNAME_MAX = 20;
const PASSWORD_MIN = 6;
const PASSWORD_MAX = 12;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_INVALID_CHARS = /[^a-zA-Z0-9]/;
const PICTURE_REGEX = /^data:image\/(png|jpeg|jpg|gif|webp);base64,/;
const MAX_PICTURE_BYTES = 5 * 1024 * 1024;

export function validateUsername(username) {
  if (!username) return "Username is required.";
  if (username.length < USERNAME_MIN || username.length > USERNAME_MAX) {
    return `Username must be between ${USERNAME_MIN} and ${USERNAME_MAX} characters.`;
  }
  if (USERNAME_INVALID_CHARS.test(username)) {
    return "Username cannot contain special characters.";
  }
  return null;
}

export function validateEmail(email) {
  if (!email) return "Email is required.";
  if (!EMAIL_REGEX.test(email)) return "Please enter a valid email address.";
  return null;
}

export function validatePassword(password) {
  if (!password) return "Password is required.";
  if (password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) {
    return `Password must be between ${PASSWORD_MIN} and ${PASSWORD_MAX} characters.`;
  }
  if (!/\d/.test(password)) {
    return "Password must include at least one number.";
  }
  return null;
}

export function validateUsernameOrEmail(value) {
  if (!value) return "Username or email is required.";
  if (value.includes("@")) {
    if (!EMAIL_REGEX.test(value)) return "Please enter a valid email address.";
    return null;
  }
  if (value.length < USERNAME_MIN || value.length > USERNAME_MAX) {
    return `Username must be between ${USERNAME_MIN} and ${USERNAME_MAX} characters.`;
  }
  return null;
}

export function validatePicture(picture) {
  if (picture === null) return null;
  if (typeof picture !== "string") return "Invalid picture format.";
  if (!PICTURE_REGEX.test(picture)) return "Picture must be an image file.";
  if (picture.length > MAX_PICTURE_BYTES) return "Image is too large (max ~5MB).";
  return null;
}

function publicView(user) {
  return {
    name: user.username,
    picture: user.picture,
    stats: user.stats,
  };
}

export async function register({ username, email, password }) {
  const existing = await User.findByUsernameOrEmail({ username, email });
  if (existing) {
    const errors = {};
    if (existing.username === username) errors.username = "Username already taken.";
    if (existing.email === email) errors.email = "Email already taken.";
    const err = new Error("Conflict");
    err.status = 409;
    err.errors = errors;
    throw err;
  }

  const user = await User.createUser({ username, email, password });
  return { user, view: publicView(user) };
}

export async function login({ usernameOrEmail, password }) {
  const isEmail = usernameOrEmail.includes("@");
  const user = await User.findByLogin(usernameOrEmail);
  if (!user) {
    const message = isEmail ? "Email not found." : "Username not found.";
    const err = new Error("Unauthorized");
    err.status = 401;
    err.errors = { usernameOrEmail: message };
    throw err;
  }

  const ok = await User.verifyPassword(user, password);
  if (!ok) {
    const err = new Error("Unauthorized");
    err.status = 401;
    err.errors = { password: "Password does not match." };
    throw err;
  }

  return { user, view: publicView(user) };
}

export async function getProfile(userId) {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error("User not found");
    err.status = 401;
    throw err;
  }
  return publicView(user);
}

export async function changeUsername(userId, username) {
  const current = await User.findById(userId);
  if (!current) {
    const err = new Error("User not found");
    err.status = 401;
    throw err;
  }
  if (current.username === username) {
    const err = new Error("Bad request");
    err.status = 400;
    err.errors = { username: "New username must be different from current." };
    throw err;
  }

  const existing = await User.findByUsername(username);
  if (existing) {
    const err = new Error("Conflict");
    err.status = 409;
    err.errors = { username: "Username already taken." };
    throw err;
  }

  const user = await User.updateUsername(userId, username);
  return publicView(user);
}

export async function getPictureByUsername(username) {
  if (!username) return null;
  const user = await User.findByUsername(username);
  return user?.picture ?? null;
}

export async function getRoomIdentityByUsername(username) {
  if (!username) return { userId: null, picture: null };
  const user = await User.findByUsername(username);
  if (!user) return { userId: null, picture: null };
  return { userId: String(user._id), picture: user.picture ?? null };
}

export async function changePicture(userId, picture) {
  const user = await User.updatePicture(userId, picture);
  if (!user) {
    const err = new Error("User not found");
    err.status = 401;
    throw err;
  }
  return publicView(user);
}
