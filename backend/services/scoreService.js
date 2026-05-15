"use strict";

import { getStats, updateStats } from "../models/user.js";

const SCORING = {
  minUniqueLetters: 2,
  basePointsPerLetter: 5,
  bonusFactor: 2,
};

/**
 * Score a word based on how many distinct letters it has. Words with
 * fewer than `minUniqueLetters` get 0. Otherwise the score grows
 * quadratically, so longer/more varied words pay off more.
 *
 * @param {string} word
 * @returns {number}
 */
function calculateWordScore(word) {
  const distinct = new Set(word).size;
  if (distinct < SCORING.minUniqueLetters) return 0;
  return SCORING.basePointsPerLetter * distinct + SCORING.bonusFactor * distinct * distinct;
}

/**
 * Score a word for a logged-in user and update their stats.
 *
 * If the master word has changed since their last submission, the player's
 * `foundWords` list is reset. Re-submitting the same word for the same
 * master word throws a 400. Also tracks the player's longest word.
 *
 * @param {string} userId
 * @param {string} word - The word the player submitted.
 * @param {string} masterWord - The current master word.
 * @returns {Promise<{ points: number, currentScore: number }>}
 */
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

/**
 * Clear the player's "found words" list and forget the last master word.
 * Used between games so old submissions don't block new ones.
 *
 * @param {string} userId
 * @returns {Promise<void>}
 */
export async function resetFoundWords(userId) {
  await updateStats(userId, { $set: { foundWords: [], lastMasterWord: null } });
}

/**
 * Mark the start of a new match for a user. Bumps `gamesPlayed` and zeroes
 * out per-match counters (score, words, found list).
 *
 * @param {string} userId
 * @returns {Promise<void>}
 */
export async function startGame(userId) {
  await updateStats(userId, {
    $inc: { gamesPlayed: 1 },
    $set: { currentScore: 0, wordsCurrentMatch: 0, foundWords: [], lastMasterWord: null }
  });
}

/**
 * Mark the end of a match. Folds per-match counters into all-time totals,
 * bumps the win streak (or resets it on a loss), updates the player's
 * personal bests, and recomputes derived stats like win rate and average
 * word length.
 *
 * @param {string} userId
 * @param {boolean} win - True if the player won.
 * @returns {Promise<void>}
 */
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
