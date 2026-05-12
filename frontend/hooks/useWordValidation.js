"use strict";

import { useState } from "react";
import { api } from "../lib/api.js";

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
