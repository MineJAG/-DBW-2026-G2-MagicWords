"use strict";

import { useRef, useEffect, useState } from "react";
import { useProfileValidation } from "./useProfileValidation.js";
import { useUser } from "../context/userContext.jsx";
import { api } from "../lib/api.js";

export function useChangeUsername(username) {
  const { setUser } = useUser();
  const [isEditingName, setIsEditingName] = useState(false);
  const inputRef = useRef(null);

  const {
    username: editName,
    setUsername: setEditName,
    errors,
    setErrors,
    handleSubmit: validateName,
    resetValidation,
  } = useProfileValidation(username);

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  async function handleConfirm() {
    const isValid = validateName();
    if (!isValid) return false;

    try {
      const data = await api.updateUsername({ username: editName.trim() });
      setUser(data);
      setIsEditingName(false);
      return true;
    } catch (e) {
      if (e.status === 409 || e.status === 400) {
        setErrors(e.errors);
      }
      return false;
    }
  }

  function handleCancel() {
    resetValidation(username);
    setIsEditingName(false);
  }

  function handleStartEditing() {
    resetValidation(username);
    setIsEditingName(true);
  }

  return {
    isEditingName,
    inputRef,
    editName,
    setEditName,
    errors,
    handleConfirm,
    handleCancel,
    handleStartEditing,
  };
}
