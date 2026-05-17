"use strict";

import * as masterWordService from "../services/masterWordService.js";

/**
 * Pick a new master word and send it back to the client. The master word is
 * the big word players draw letters from to make smaller words.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>} Responds with `{ masterWord }` on success.
 */
export async function generate(req, res) {
  try {
    const masterWord = masterWordService.generateMasterWord();
    res.status(200).json({ masterWord });
  } catch (e) {
    console.error("Master word generate error:", e);
    res.status(500).json({ error: "Server error" });
  }
}
