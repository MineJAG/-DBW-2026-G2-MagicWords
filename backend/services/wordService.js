"use strict";

import { isEnglishWord } from "../models/word.js";

const MIN_WORD_LENGTH = 2;
const LETTERS_ONLY = /^[a-zA-ZÀ-ÿ]+$/;

export function hasValidLetters(word, master) {
  const upperMaster = master.toUpperCase();
  for (const letter of word.toUpperCase()) {
    if (!upperMaster.includes(letter)) return false;
  }
  return true;
}

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
