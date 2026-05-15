"use strict";

import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 20 },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    picture: { type: String, default: null },

    stats: {
      gamesPlayed: { type: Number, default: 0 },
      gamesWon: { type: Number, default: 0 },
      winRate: { type: Number, default: 0 },

      totalWordsFound: { type: Number, default: 0 },
      averageWordLength: { type: Number, default: 0 },
      longestWordFound: { type: String, default: null },
      totalCharacterCount: { type: Number, default: 0 },

      highestScore: { type: Number, default: 0 },
      mostWordsInOneMatch: { type: Number, default: 0 },
      streak: { type: Number, default: 0 },
      currentScore: { type: Number, default: 0 },
      wordsCurrentMatch: { type: Number, default: 0 },
      foundWords: { type: [String], default: [] },
      lastMasterWord: { type: String, default: null },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

/**
 * Look up a user that matches the given username OR email. Used to check
 * if either is already taken before creating an account.
 *
 * @param {{ username: string, email: string }} params
 * @returns {Promise<object | null>} The user document, or null if none match.
 */
export async function findByUsernameOrEmail({ username, email }) {
  return User.findOne({ $or: [{ username }, { email }] });
}

/**
 * Find the user behind a login form value. If the value contains an "@" we
 * treat it as an email, otherwise as a username.
 *
 * @param {string} usernameOrEmail
 * @returns {Promise<object | null>}
 */
export async function findByLogin(usernameOrEmail) {
  const isEmail = usernameOrEmail.includes("@");
  const query = isEmail
    ? { email: usernameOrEmail.toLowerCase() }
    : { username: usernameOrEmail };
  return User.findOne(query);
}

/**
 * Find a user by their MongoDB id.
 *
 * @param {string} id
 * @returns {Promise<object | null>}
 */
export async function findById(id) {
  return User.findById(id);
}

/**
 * Find a user by username (exact match).
 *
 * @param {string} username
 * @returns {Promise<object | null>}
 */
export async function findByUsername(username) {
  return User.findOne({ username });
}

/**
 * Create a new user. Hashes the password before saving it; the plain
 * password is never stored.
 *
 * @param {{ username: string, email: string, password: string }} params
 * @returns {Promise<object>} The new user document.
 */
export async function createUser({ username, email, password }) {
  const passwordHash = await bcrypt.hash(password, 10);
  return User.create({ username, email, passwordHash });
}

/**
 * Check whether a plain password matches the user's stored hash.
 *
 * @param {object} user - A user document with a `passwordHash` field.
 * @param {string} password - The plain password to test.
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(user, password) {
  return bcrypt.compare(password, user.passwordHash);
}

/**
 * Change a user's username and return the updated document.
 *
 * @param {string} id
 * @param {string} username
 * @returns {Promise<object | null>}
 */
export async function updateUsername(id, username) {
  return User.findByIdAndUpdate(id, { username }, { returnDocument: "after" });
}

/**
 * Change a user's profile picture and return the updated document.
 *
 * @param {string} id
 * @param {string | null} picture - A data URL, or null to clear.
 * @returns {Promise<object | null>}
 */
export async function updatePicture(id, picture) {
  return User.findByIdAndUpdate(id, { picture }, { returnDocument: "after" });
}

/**
 * Read just the `stats` subdocument for a user (skipping the rest).
 *
 * @param {string} id
 * @returns {Promise<object | null>} The stats object, or null if user not found.
 */
export async function getStats(id) {
  const user = await User.findById(id).select("stats");
  return user?.stats ?? null;
}

/**
 * Apply Mongo-style update operators (`$set`, `$inc`, `$max`, etc.) to the
 * user's `stats` subdocument. Each key inside an operator is rewritten as
 * `stats.<key>` so callers can pass field names without the prefix.
 *
 * @example
 * // Increment gamesPlayed by 1 and set highestScore to 42
 * updateStats(id, { $inc: { gamesPlayed: 1 }, $set: { highestScore: 42 } });
 *
 * @param {string} id
 * @param {Object<string, Object<string, any>>} updates - Map of operator → field map.
 * @returns {Promise<object | null>} The updated stats object, or null if user not found.
 */
export async function updateStats(id, updates) {
  const mongoUpdate = {};

  for (const [operator, fields] of Object.entries(updates)) {
    if (!operator.startsWith("$")) continue;
    mongoUpdate[operator] = {};
    for (const [key, value] of Object.entries(fields)) {
      mongoUpdate[operator][`stats.${key}`] = value;
    }
  }

  const user = await User.findByIdAndUpdate(id, mongoUpdate, { returnDocument: "after" }).select("stats");
  return user?.stats ?? null;
}

export default User;
