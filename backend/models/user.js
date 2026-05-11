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
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export async function findByUsernameOrEmail({ username, email }) {
  return User.findOne({ $or: [{ username }, { email }] });
}

export async function findByLogin(usernameOrEmail) {
  const isEmail = usernameOrEmail.includes("@");
  const query = isEmail
    ? { email: usernameOrEmail.toLowerCase() }
    : { username: usernameOrEmail };
  return User.findOne(query);
}

export async function findById(id) {
  return User.findById(id);
}

export async function findByUsername(username) {
  return User.findOne({ username });
}

export async function createUser({ username, email, password }) {
  const passwordHash = await bcrypt.hash(password, 10);
  return User.create({ username, email, passwordHash });
}

export async function verifyPassword(user, password) {
  return bcrypt.compare(password, user.passwordHash);
}

export async function updateUsername(id, username) {
  return User.findByIdAndUpdate(id, { username }, { returnDocument: "after" });
}

export async function updatePicture(id, picture) {
  return User.findByIdAndUpdate(id, { picture }, { returnDocument: "after" });
}

export async function getStats(id) {
  const user = await User.findById(id).select("stats");
  return user?.stats ?? null;
}

export async function setStats(id, stats) {
  const update = {};
  for (const [key, value] of Object.entries(stats)) {
    update[`stats.${key}`] = value;
  }
  const user = await User.findByIdAndUpdate(id, { $set: update }, { returnDocument: "after" }).select("stats");
  return user?.stats ?? null;
}

export default User;
