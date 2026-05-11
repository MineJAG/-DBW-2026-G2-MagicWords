"use strict";

import * as wordService from "../services/wordService.js";
import * as scoreService from "../services/scoreService.js";
import * as roomService from "../services/roomService.js";
import * as userService from "../services/userService.js";
import { getAuthUserId } from "./cookieController.js";
import { getIO } from "../socket/index.js";

export async function validate(req, res) {
  const word = String(req.body.word ?? "").trim();
  const masterWord = String(req.body.masterWord ?? "").trim();
  const roomCode = String(req.body.room ?? "").trim();

  try {
    const result = wordService.submitGuess({ word, masterWord });
    const userId = getAuthUserId(req);
    const score = userId
      ? await scoreService.submitWord(userId, result.word)
      : { points: 0, currentScore: 0 };

    if (roomCode && userId) {
      try {
        const user = await userService.getProfile(userId);
        const room = roomService.updatePlayerScore({
          code: roomCode,
          name: user.name,
          score: score.currentScore,
        });
        getIO().to(room.code).emit("room:update", room);
      } catch (roomSyncError) {
        console.error("Room score sync error:", roomSyncError);
      }
    }

    res.status(200).json({ ...result, ...score });
  } catch (e) {
    if (e.status) return res.status(e.status).json({ errors: e.errors });
    console.error("Word validate error:", e);
    res.status(500).json({ error: "Server error" });
  }
}
