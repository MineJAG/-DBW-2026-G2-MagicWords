"use strict";

import englishWords from "an-array-of-english-words" with { type: "json" };

export const englishSet = new Set(englishWords);

/**
 * Check whether a string is a real English word, ignoring case. Backed by
 * a Set so the lookup is fast.
 *
 * @param {string} word
 * @returns {boolean}
 */
export function isEnglishWord(word) {
  return englishSet.has(String(word).toLowerCase());
}

/**
 * Pick a random English word from the dictionary.
 *
 * @returns {string}
 */
export function randomEnglishWord() {
  return englishWords[Math.floor(Math.random() * englishWords.length)];
}
