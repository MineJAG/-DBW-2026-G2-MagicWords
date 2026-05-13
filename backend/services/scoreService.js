"use strict";

import { getStats, updateStats } from "../models/user.js";

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

export async function submitWord(userId, word, masterWord) {
  const normalized = word.trim().toUpperCase();
  const normalizedMaster = masterWord.trim().toUpperCase();
  const stats = await getStats(userId);

  if (stats.lastMasterWord !== normalizedMaster) {
    await updateStats(userId, {
      $set: { foundWords: [], lastMasterWord: normalizedMaster }
    });
  } else if (stats.foundWords?.includes(normalized)) {
    const err = new Error("Word already submitted.");
    err.status = 400;
    err.errors = { word: "Word already submitted." };
    throw err;
  }

  const points = calculateWordScore(normalized);

  const updated = await updateStats(userId, {
    $inc: {
      currentScore: points,
      wordsCurrentMatch: 1,
      totalCharacterCount: normalized.length,
    },
    $addToSet: { foundWords: normalized },
  });

  if (normalized.length > (stats.longestWordFound?.length ?? 0)) {
    await updateStats(userId, { $set: { longestWordFound: normalized } });
  }

  return { points, currentScore: updated.currentScore };
}

export async function resetFoundWords(userId) {
  await updateStats(userId, { $set: { foundWords: [], lastMasterWord: null } });
}

export async function startGame(userId) {
  await updateStats(userId, {
    $inc: { gamesPlayed: 1 },
    $set: { currentScore: 0, wordsCurrentMatch: 0, foundWords: [], lastMasterWord: null }
  });
}

export async function finishGame(userId, win) {
  const stats = await getStats(userId);
  const updates = {
    $set: { foundWords: [], lastMasterWord: null },
    $inc: { totalWordsFound: stats.wordsCurrentMatch, totalCharacterCount: 0 },
  };

  if (win) {
    updates.$inc.gamesWon = 1;
    updates.$inc.streak = 1;
  } else {
    updates.$set.streak = 0;
  }

  updates.$max = {
    highestScore: stats.currentScore,
    mostWordsInOneMatch: stats.wordsCurrentMatch
  };

  const updated = await updateStats(userId, updates);
  
  const gamesPlayed = updated.gamesPlayed || 1;
  const totalWords = updated.totalWordsFound || 1;
  
  await updateStats(userId, {
    $set: {
      winRate: (updated.gamesWon / gamesPlayed) * 100,
      averageWordLength: updated.totalCharacterCount / totalWords
    }
  });
}
