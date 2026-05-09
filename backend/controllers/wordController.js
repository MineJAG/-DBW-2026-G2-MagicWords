"use strict";

import * as Word from "../models/word.js";

function hasValidLetters(word, master) {
  const w = word.toUpperCase().split("");
  const m = master.toUpperCase();
  for (const letter of w) {
    if (!m.includes(letter)) return false;
  }
  return true;
}

export async function validate(req, res) {
  const word = String(req.body.word ?? "").trim();
  const masterWord = String(req.body.masterWord ?? "").trim();

  if (!masterWord) {
    return res
      .status(400)
      .json({ errors: { masterWord: "Master word is required." } });
  }

  if (!word) {
    return res.status(400).json({ errors: { word: "Please enter a word." } });
  } else if (word.length < 2) {
    return res
      .status(400)
      .json({ errors: { word: "Word must have at least 2 letters." } });
  } else if (/[^a-zA-ZÀ-ÿ]/.test(word)) {
    return res
      .status(400)
      .json({ errors: { word: "Word can only contain letters." } });
  } else if (!hasValidLetters(word, masterWord)) {
    return res.status(400).json({
      errors: {
        word: "Your word contains letters that are not in the master word.",
      },
    });
  } else if (!Word.isEnglishWord(word)) {
    return res
      .status(400)
      .json({ errors: { word: "Word is not in the English dictionary." } });
  }

  res.status(200).json({ word: word.toUpperCase() });
}
