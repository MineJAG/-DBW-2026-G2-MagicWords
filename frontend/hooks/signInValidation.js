"use strict";
import { useState } from "react";

export function signInFormValidation() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerification, setPasswordVerification] = useState("");
  const [errors, setErrors] = useState({});

  function validate() {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required.";
    } else if (username.length < 5 || username.length > 20) {
      newErrors.username = "Username must be between 5 and 20 characters.";
    } else if (/[^a-zA-Z0-9]/.test(username)) {
      newErrors.username = "Username cannot contain special characters.";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6 || password.length > 12) {
      newErrors.password = "Password must be between 6 and 12 characters.";
    } else if (!/\d/.test(password)) {
      newErrors.password = "Password must include at least one number.";
    }

    if (!passwordVerification) {
      newErrors.passwordVerification = "Please confirm your password.";
    } else if (password !== passwordVerification) {
      newErrors.passwordVerification = "Passwords do not match.";
    }

    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
  }

  return {
    username, setUsername,
    email, setEmail,
    password, setPassword,
    passwordVerification, setPasswordVerification,
    errors,
    handleSubmit,
  };
}