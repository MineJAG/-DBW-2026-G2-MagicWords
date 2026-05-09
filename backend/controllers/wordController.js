"use strict";

import * as wordService from "../services/wordService.js";

export async function validate(req, res) {
  const word = String(req.body.word ?? "").trim();
  const masterWord = String(req.body.masterWord ?? "").trim();

  try {
    const result = wordService.submitGuess({ word, masterWord });
    res.status(200).json(result);
  } catch (e) {
    if (e.status) return res.status(e.status).json({ errors: e.errors });
    console.error("Word validate error:", e);
    res.status(500).json({ error: "Server error" });
  }
}
