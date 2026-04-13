"use strict";
import { useState } from "react";

export function signUpFormValidation() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  function validate() {
    const newErrors = {};

    if (!usernameOrEmail.trim()) {
      newErrors.usernameOrEmail = "Username or email is required.";
    } else if (usernameOrEmail.includes("@")) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usernameOrEmail)) {
        newErrors.usernameOrEmail = "Please enter a valid email address.";
      }
    }
    if (!password) {
      newErrors.password = "Password is required.";
    }

    return newErrors;
  }
  function handleSubmit(e) {
    e.preventDefault();
    const validateErrors = validate();
    setErrors(validateErrors);
  }

  return {
    usernameOrEmail,
    setUsernameOrEmail,
    password,
    setPassword,
    errors,
    handleSubmit,
  };
}
