"use strict";
import { useState } from "react";


export function signInFormValidation() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerification, setPasswordVerification] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    console.log(username);
  }

  return { username, setUsername, email, setEmail, password, setPassword,
           passwordVerification, setPasswordVerification, handleSubmit };
}