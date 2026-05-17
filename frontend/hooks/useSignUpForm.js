"use strict";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api.js";
import { useUser } from "../context/userContext.jsx";

/**
 * Controlled state + validation + submit for the sign-up form. Enforces:
 * - username 5–20 chars, alphanumeric only,
 * - email matches a basic RFC-ish pattern,
 * - password 6–12 chars and includes at least one digit,
 * - password confirmation matches.
 *
 * On success populates the user context and navigates to `/home`. On 400/409
 * the server's per-field errors are shown inline (e.g. "username taken").
 *
 * @returns {{
 *   username: string, setUsername: (value: string) => void,
 *   email: string, setEmail: (value: string) => void,
 *   password: string, setPassword: (value: string) => void,
 *   passwordVerification: string, setPasswordVerification: (value: string) => void,
 *   errors: Record<string, string>,
 *   handleSubmit: (e: Event) => Promise<void>,
 * }}
 */
export function useSignUpForm() {
  const navigate = useNavigate();
  const { setUser } = useUser();

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

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const data = await api.register({ username, email, password });
      setUser(data);
      navigate("/home", { replace: true });
    } catch (e) {
      if (e.status === 409 || e.status === 400) {
        setErrors(e.errors);
      }
    }
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
