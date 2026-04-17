"use strict";

export const SCORING_CONFIG = {
  totalTime: 600,
  minWordLength: 2,
  basePointsPerLetter: 5,
  lengthBonusFactor: 2,
  maxSpeedBonus: 50,
};

export function calculateWordScore(word, timeLeft, config = {}) {
  const {
    totalTime,
    minWordLength,
    basePointsPerLetter,
    lengthBonusFactor,
    maxSpeedBonus,
  } = { ...SCORING_CONFIG, ...config };

  if (typeof word !== "string") return 0;
  const length = word.trim().length;
  if (length < minWordLength) return 0;

  const letterScore =
    basePointsPerLetter * length + lengthBonusFactor * length * length;

  const remaining = Math.max(0, Math.min(Number(timeLeft) || 0, totalTime));
  const speedBonus = Math.round((remaining / totalTime) * maxSpeedBonus);

  return letterScore + speedBonus;
}

export function calculateTotalScore(submissions = [], config = {}) {
  return submissions.reduce(
    (total, { word, timeLeft }) =>
      total + calculateWordScore(word, timeLeft, config),
    0
  );
}
