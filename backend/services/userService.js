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

/**
 * Check a username's shape. Returns null when it's fine, or a short error
 * message when something's wrong (missing, wrong length, special chars).
 *
 * @param {string} username
 * @returns {string | null}
 */
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

/**
 * Check an email's shape. Returns null when it's fine, or an error message.
 *
 * @param {string} email
 * @returns {string | null}
 */
export function validateEmail(email) {
  if (!email) return "Email is required.";
  if (!EMAIL_REGEX.test(email)) return "Please enter a valid email address.";
  return null;
}

/**
 * Check a password's shape. Returns null when it's fine, or an error
 * message (missing, wrong length, or no digit).
 *
 * @param {string} password
 * @returns {string | null}
 */
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

/**
 * Validate a login form value that could be either a username or an email.
 * If it contains "@" we check it as an email, otherwise as a username.
 *
 * @param {string} value
 * @returns {string | null}
 */
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

/**
 * Check a profile picture. Allows `null` (clearing the picture), needs the
 * value to be a base64 data URL for png/jpg/gif/webp, and rejects anything
 * over ~5MB.
 *
 * @param {string | null} picture
 * @returns {string | null}
 */
export function validatePicture(picture) {
  if (picture === null) return null;
  if (typeof picture !== "string") return "Invalid picture format.";
  if (!PICTURE_REGEX.test(picture)) return "Picture must be an image file.";
  if (picture.length > MAX_PICTURE_BYTES) return "Image is too large (max ~5MB).";
  return null;
}

/**
 * Trim a full user document down to the safe fields we send back to the
 * frontend. No password hash, no email, no internal flags.
 *
 * @param {object} user
 * @returns {{ name: string, picture: string | null, stats: object }}
 */
function publicView(user) {
  return {
    name: user.username,
    picture: user.picture,
    stats: user.stats,
  };
}

/**
 * Create a new account. If the username or email is already taken,
 * throws a 409 with per-field errors. On success returns the user
 * document and a safe view to send to the client.
 *
 * @param {{ username: string, email: string, password: string }} params
 * @returns {Promise<{ user: object, view: object }>}
 */
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

/**
 * Log a user in. Throws 401 if the username/email doesn't exist or the
 * password is wrong. The error message tells the caller which side failed
 * so the form can highlight the right field.
 *
 * @param {{ usernameOrEmail: string, password: string }} params
 * @returns {Promise<{ user: object, view: object }>}
 */
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

/**
 * Get a user's public profile by id. Throws 401 if the user is gone (the
 * frontend treats this the same as not being logged in).
 *
 * @param {string} userId
 * @returns {Promise<object>}
 */
export async function getProfile(userId) {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error("User not found");
    err.status = 401;
    throw err;
  }
  return publicView(user);
}

/**
 * Change a user's username. Refuses if the user doesn't exist (401), if
 * the name is the same as before (400), or if someone else already has
 * that name (409).
 *
 * @param {string} userId
 * @param {string} username
 * @returns {Promise<object>} The updated public view.
 */
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

/**
 * Look up just a user's profile picture by their username. Returns null
 * if the user isn't found or has no picture.
 *
 * @param {string} username
 * @returns {Promise<string | null>}
 */
export async function getPictureByUsername(username) {
  if (!username) return null;
  const user = await User.findByUsername(username);
  return user?.picture ?? null;
}

/**
 * Get the bits the room system needs about a user: their id (as a string)
 * and their picture. Returns `{ userId: null, picture: null }` for guests
 * or unknown usernames so the caller can spread it safely.
 *
 * @param {string} username
 * @returns {Promise<{ userId: string | null, picture: string | null }>}
 */
export async function getRoomIdentityByUsername(username) {
  if (!username) return { userId: null, picture: null };
  const user = await User.findByUsername(username);
  if (!user) return { userId: null, picture: null };
  return { userId: String(user._id), picture: user.picture ?? null };
}

/**
 * Save a new profile picture for the user. Throws 401 if the user is gone.
 * Picture validation should already have run in the controller.
 *
 * @param {string} userId
 * @param {string | null} picture
 * @returns {Promise<object>} The updated public view.
 */
export async function changePicture(userId, picture) {
  const user = await User.updatePicture(userId, picture);
  if (!user) {
    const err = new Error("User not found");
    err.status = 401;
    throw err;
  }
  return publicView(user);
}
