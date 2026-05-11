"use strict";

import { useState } from "react";
import { api } from "../lib/api.js";

export function useWordValidation(masterWord, submittedWords = []) {
  const [word, setWord] = useState("");
  const [errors, setErrors] = useState({});

  function hasValidLetters(value, master) {
    const upperMaster = master.toUpperCase();
    for (const letter of value.toUpperCase()) {
      if (!upperMaster.includes(letter)) return false;
    }
    return true;
  }

  function validate(wordToValidate = word) {
    const newErrors = {};
    const trimmed = wordToValidate.trim();

    if (!trimmed) {
      newErrors.word = "Please enter a word.";
    } else if (trimmed.length < 2) {
      newErrors.word = "Word must have at least 2 letters.";
    } else if (/[^a-zA-ZÀ-ÿ]/.test(trimmed)) {
      newErrors.word = "Word can only contain letters.";
    } else if (!hasValidLetters(trimmed, masterWord)) {
      newErrors.word = "Your word contains letters that are not in the master word.";
    } else if (submittedWords.includes(trimmed.toUpperCase())) {
      newErrors.word = "Word already submitted.";
    }

    return newErrors;
  }

  async function handleSubmit(e, onValid) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      const data = await api.validateWord({ word: word.trim(), masterWord });
      setErrors({});
      if (onValid) onValid(data.word, data.currentScore);
    } catch (err) {
      if (err.status === 400 && err.errors) {
        setErrors(err.errors);
      } else {
        setErrors({ word: "Could not validate word. Try again." });
      }
    }
  }

  return { word, setWord, errors, validate, handleSubmit };
}
