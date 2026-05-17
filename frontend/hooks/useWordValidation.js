"use strict";

import { useState } from "react";
import { api } from "../lib/api.js";

/**
 * State + validation + submit for the in-game word input.
 *
 * Client-side rules: non-empty, ≥2 letters, only letters (incl. accented),
 * every letter must appear in `masterWord`, and the word can't already be in
 * `submittedWords` or in the in-flight `pendingWords` set. If those pass, the
 * word is POSTed to `/words/validate`. The server's response triggers
 * `onValid(word, currentScore)`; on a 400 the field errors are shown inline.
 *
 * `pendingWords` is tracked so two rapid submits of the same word can't both
 * succeed before the first ack arrives. `submitting` is true while any word
 * is in flight, so the caller can disable the form.
 *
 * @param {string} masterWord - The current master word.
 * @param {string[]} [submittedWords=[]] - Words already accepted this match.
 * @returns {{
 *   word: string,
 *   setWord: (value: string) => void,
 *   errors: Record<string, string>,
 *   validate: (wordToValidate?: string) => Record<string, string>,
 *   handleSubmit: (e: Event, onValid?: (word: string, currentScore: number) => void, payload?: object) => Promise<void>,
 *   submitting: boolean,
 * }}
 */
export function useWordValidation(masterWord, submittedWords = []) {
  const [word, setWord] = useState("");
  const [errors, setErrors] = useState({});
  const [pendingWords, setPendingWords] = useState(new Set());

  function hasValidLetters(value, master) {
    const upperMaster = (master ?? "").toUpperCase();
    for (const letter of value.toUpperCase()) {
      if (!upperMaster.includes(letter)) return false;
    }
    return true;
  }

  function validate(wordToValidate = word) {
    const newErrors = {};
    const trimmed = wordToValidate.trim().toUpperCase();

    if (!trimmed) {
      newErrors.word = "Please enter a word.";
    } else if (trimmed.length < 2) {
      newErrors.word = "Word must have at least 2 letters.";
    } else if (/[^a-zA-ZÀ-ÿ]/.test(trimmed)) {
      newErrors.word = "Word can only contain letters.";
    } else if (!hasValidLetters(trimmed, masterWord)) {
      newErrors.word = "Your word contains letters that are not in the master word.";
    } else if (submittedWords.includes(trimmed) || pendingWords.has(trimmed)) {
      newErrors.word = "Word already submitted.";
    }

    return newErrors;
  }

  async function handleSubmit(e, onValid, payload = {}) {
    e.preventDefault();
    const wordToSubmit = word.trim();
    const normalized = wordToSubmit.toUpperCase();

    const validationErrors = validate(wordToSubmit);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setWord("");
    setErrors({});
    setPendingWords((prev) => new Set(prev).add(normalized));

    try {
      const data = await api.validateWord({ word: wordToSubmit, masterWord, ...payload });
      if (onValid) onValid(data.word, data.currentScore);
    } catch (err) {
      if (err.status === 400 && err.errors) {
        setErrors(err.errors);
      } else {
        setErrors({ word: "Could not validate word. Try again." });
      }
    } finally {
      setPendingWords((prev) => {
        const next = new Set(prev);
        next.delete(normalized);
        return next;
      });
    }
  }

  return { word, setWord, errors, validate, handleSubmit, submitting: pendingWords.size > 0 };
}
