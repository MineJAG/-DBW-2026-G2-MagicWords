"use strict";

import englishWords from "an-array-of-english-words";

export const englishSet = new Set(englishWords);

export function isEnglishWord(word) {
  return englishSet.has(String(word).toLowerCase());
}

export function randomEnglishWord() {
  return englishWords[Math.floor(Math.random() * englishWords.length)];
}
