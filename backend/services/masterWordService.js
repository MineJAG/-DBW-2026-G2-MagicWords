"use strict";

import { randomEnglishWord } from "../models/word.js";

const MIN_LENGTH = 3;
const LETTERS_ONLY = /^[a-zA-Z]+$/;

export const CHANGE_TIME = 120000;

export function generateMasterWord() {
  while (true) {
    const word = randomEnglishWord();
    if (word.length >= MIN_LENGTH && LETTERS_ONLY.test(word)) {
      return word.toUpperCase();
    }
  }
}
