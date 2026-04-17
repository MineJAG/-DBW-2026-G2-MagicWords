"use strict";
import { useState } from "react";

export function codeValidation(onSuccess) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function handleChange(e) {
    const value = e.target.value;
    // numbers only
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