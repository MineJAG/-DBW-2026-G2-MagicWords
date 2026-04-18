"use strict";
import { useState } from "react";

export function useWordValidation(masterWord) {
  const [word, setWord] = useState("");
  const [errors, setErrors] = useState({});

  function hasValidLetters(word, master) {
    const w = word.toUpperCase().split("");
    const m = master.toUpperCase();

    for (const letter of w) {
      if (!m.includes(letter)) return false;
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
    }

    return newErrors;
  }

  function handleSubmit(e, onValid) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0 && onValid) {
      onValid(word.trim().toUpperCase());
    }
  }

  return {
    word,
    setWord,
    errors,
    validate,
    handleSubmit,
  };
}