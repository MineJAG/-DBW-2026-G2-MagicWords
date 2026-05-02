"use strict";

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
      gamesLost: { type: Number, default: 0 },
      winRate: { type: Number, default: 0 },

      totalWordsFound: { type: Number, default: 0 },
      averageWordLength: { type: Number, default: 0 },
      longestWordFound: { type: String, default: null },

      highestScore: { type: Number, default: 0 },
      mostWordsInOneMatch: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);