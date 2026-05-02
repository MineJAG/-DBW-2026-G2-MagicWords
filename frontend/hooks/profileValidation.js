"use strict";
import { useState } from "react";

export function profileValidation(currentName) {
  const [username, setUsername] = useState(currentName);
  const [errors, setErrors] = useState({});

  function validate() {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required.";
    } else if (username.length < 5 || username.length > 20) {
      newErrors.username = "Username must be between 5 and 20 characters.";
    } else if (/[^a-zA-Z0-9]/.test(username)) {
      newErrors.username = "Username cannot contain special characters.";
    } else if (username.trim() === currentName) {
      newErrors.username = "New username must be different from current.";
    }

    return newErrors;
  }

  function handleSubmit() {
    const validationErrors = validate();
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }

  function resetValidation(name) {
    setUsername(name);
    setErrors({});
  }

  return {
    username, setUsername,
    errors, setErrors,
    handleSubmit,
    resetValidation,
  };
}