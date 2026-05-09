"use strict";

import { createRequire } from "module";

const require = createRequire(import.meta.url);
const englishWords = require("an-array-of-english-words");

const englishSet = new Set(englishWords);

export function isEnglishWord(word) {
  return englishSet.has(String(word).toLowerCase());
}
