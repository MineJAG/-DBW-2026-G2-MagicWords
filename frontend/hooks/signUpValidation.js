"use strict";
import { useState } from "react";

export function signUpFormValidation() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    console.log(usernameOrEmail);
  }

  return { usernameOrEmail, setUsernameOrEmail,  password, setPassword, handleSubmit };
}