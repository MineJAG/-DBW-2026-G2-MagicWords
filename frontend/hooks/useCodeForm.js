"use strict";

import { useState } from "react";

/**
 * Controlled state for the "join by code" input. Only allows digits; rejects
 * empty submissions with an inline error. On a valid submit, calls
 * `onSuccess(code)` then clears the field.
 *
 * @param {(code: string) => void} onSuccess - Called with the entered code.
 * @returns {{
 *   code: string,
 *   error: string,
 *   handleChange: (e: Event) => void,
 *   handleSubmit: (e: Event) => void,
 *   reset: () => void,
 * }}
 */
export function useCodeForm(onSuccess) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function handleChange(e) {
    const value = e.target.value;
    if (value === "" || /^[0-9]+$/.test(value)) {
      setCode(value);
      setError("");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!code) {
      setError("Please enter a code.");
      return;
    }
    onSuccess(code);
    setCode("");
    setError("");
  }

  function reset() {
    setCode("");
    setError("");
  }

  return { code, error, handleChange, handleSubmit, reset };
}
