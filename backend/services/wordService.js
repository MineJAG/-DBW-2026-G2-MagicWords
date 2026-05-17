"use strict";

import { isEnglishWord } from "../models/word.js";

const MIN_WORD_LENGTH = 2;
const LETTERS_ONLY = /^[a-zA-ZÀ-ÿ]+$/;

/**
 * Check whether every letter in `word` appears somewhere in `master`.
 * Case-insensitive. Doesn't care about how often a letter shows up.
 *
 * @param {string} word
 * @param {string} master
 * @returns {boolean}
 */
export function hasValidLetters(word, master) {
  const upperMaster = master.toUpperCase();
  for (const letter of word.toUpperCase()) {
    if (!upperMaster.includes(letter)) return false;
  }
  return true;
}

/**
 * Run every rule against a guess: must be present, long enough, letters
 * only, different from the master word, only use letters from the master,
 * and be a real English word. Returns `null` if all rules pass, otherwise
 * a `{ field: message }` object for the first rule that failed.
 *
 * @param {{ word: string, masterWord: string }} params
 * @returns {Object<string, string> | null}
 */
export function validateGuess({ word, masterWord }) {
  if (!masterWord) return { masterWord: "Master word is required." };
  if (!word) return { word: "Please enter a word." };
  if (word.length < MIN_WORD_LENGTH) {
    return { word: `Word must have at least ${MIN_WORD_LENGTH} letters.` };
  }
  if (!LETTERS_ONLY.test(word)) {
    return { word: "Word can only contain letters." };
  }
  if (word.toUpperCase() === masterWord.toUpperCase()) {
    return { word: "Your word cannot be the master word." };
  }
  if (!hasValidLetters(word, masterWord)) {
    return { word: "Your word contains letters that are not in the master word." };
  }
  if (!isEnglishWord(word)) {
    return { word: "Word is not in the English dictionary." };
  }
  return null;
}

/**
 * Validate a guess and turn it into a 400 error if any rule fails.
 * On success returns the uppercased word so the controller can use a
 * canonical form for scoring and storage.
 *
 * @param {{ word: string, masterWord: string }} params
 * @returns {{ word: string }}
 */
export function submitGuess({ word, masterWord }) {
  const errors = validateGuess({ word, masterWord });
  if (errors) {
    const err = new Error("Bad request");
    err.status = 400;
    err.errors = errors;
    throw err;
  }
  return { word: word.toUpperCase() };
}
