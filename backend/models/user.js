"use strict";

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  picture: { type: String, default: null },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  stats: {
    currentScore: { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 },
    highestScore: { type: Number, default: 0 },
    gamesWon: { type: Number, default: 0 },
    gamesLost: { type: Number, default: 0 },
    winRate: { type: Number, default: 0 },
    totalWordsFound: { type: Number, default: 0 },
    longestWordFound: { type: String, default: null },
    averageWordLength: { type: Number, default: 0 },
    mostWordsInOneMatch: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
  },
});

export default mongoose.model("User", userSchema);


