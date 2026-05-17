"use strict";

import { useState } from "react";

/**
 * Local-only validation for changing a username. Enforces the same rules as
 * sign-up (length 5–20, alphanumeric only) plus a "must differ from current"
 * rule. Returns the edited value, an errors map, and a `handleSubmit` that
 * runs validation and returns whether the submit is allowed to proceed.
 *
 * Does not call the API — that's the caller's job (see
 * {@link useChangeUsername}). `setErrors` is exposed so the caller can
 * surface server-side errors (e.g. 409 username-taken).
 *
 * @param {string} currentName - The user's existing username.
 * @returns {{
 *   username: string,
 *   setUsername: (value: string) => void,
 *   errors: Record<string, string>,
 *   setErrors: (errors: Record<string, string>) => void,
 *   handleSubmit: () => boolean,
 *   resetValidation: (name: string) => void,
 * }}
 */
export function useProfileValidation(currentName) {
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
