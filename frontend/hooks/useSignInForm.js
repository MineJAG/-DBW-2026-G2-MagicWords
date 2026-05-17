"use strict";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api.js";
import { useUser } from "../context/userContext.jsx";

/**
 * Controlled state + validation + submit for the sign-in form. Accepts either
 * a username or an email in the `usernameOrEmail` field (detected by `@`).
 * On a successful login, populates the user context and navigates to
 * `/home`. On 400/401 the field errors from the server are shown inline.
 *
 * @returns {{
 *   usernameOrEmail: string,
 *   setUsernameOrEmail: (value: string) => void,
 *   password: string,
 *   setPassword: (value: string) => void,
 *   errors: Record<string, string>,
 *   handleSubmit: (e: Event) => Promise<void>,
 * }}
 */
export function useSignInForm() {
  const navigate = useNavigate();
  const { setUser } = useUser();

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
    } else if (usernameOrEmail.length < 5 || usernameOrEmail.length > 20) {
      newErrors.usernameOrEmail = "Username must be between 5 and 20 characters.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    }

    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const data = await api.login({ usernameOrEmail, password });
      setUser(data);
      navigate("/home", { replace: true });
    } catch (e) {
      if (e.status === 401 || e.status === 400) {
        setErrors(e.errors);
      }
    }
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
