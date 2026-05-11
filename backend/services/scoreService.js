"use strict";

import { getStats, setStats } from "../models/user.js";

const SCORING = {
  minUniqueLetters: 2,
  basePointsPerLetter: 5,
  bonusFactor: 2,
};

function calculateWordScore(word) {
  const distinct = new Set(word).size;
  if (distinct < SCORING.minUniqueLetters) return 0;
  return SCORING.basePointsPerLetter * distinct + SCORING.bonusFactor * distinct * distinct;
}

export async function submitWord(userId, word) {
  const normalized = word.trim().toUpperCase();
  const points = calculateWordScore(normalized);
  const stats = await getStats(userId);

  await setStats(userId, { currentScore: stats.currentScore + points });
  await setStats(userId, { wordsCurrentMatch: stats.wordsCurrentMatch + 1 });
  await setStats(userId, { totalCharacterCount: stats.totalCharacterCount + normalized.length });
  if (normalized.length > (stats.longestWordFound?.length ?? 0)) {
    await setStats(userId, { longestWordFound: normalized });
  }
  const updated = await getStats(userId);
  return { points, currentScore: updated.currentScore };
}

export async function startGame(userId) {
  const stats = await getStats(userId);
  await setStats(userId, { gamesPlayed: stats.gamesPlayed + 1 });
  await setStats(userId, { currentScore: 0 });
  await setStats(userId, { wordsCurrentMatch: 0 });
}

export async function finishGame(userId, win) {
  const stats = await getStats(userId);
  if (win) {
    await setStats(userId, { gamesWon : stats.gamesWon + 1 });
    await setStats(userId, { winRate : (stats.gamesWon / stats.gamesPlayed) * 100 });
    await setStats(userId, {streak : stats.streak + 1});
  } else {
    await setStats(userId, {streak : 0});
  }
  
  if (stats.currentScore > stats.highestScore) {
    await setStats(userId, { highestScore: stats.currentScore });
  }

  if (stats.wordsCurrentMatch > stats.mostWordsInOneMatch) {
    await setStats(userId, { mostWordsInOneMatch: stats.wordsCurrentMatch });
  }

  await setStats(userId, { totalWordsFound: stats.totalWordsFound + stats.wordsCurrentMatch });
  await setStats(userId, { averageWordLength : stats.totalCharacterCount + stats.totalWordsFound });
}
