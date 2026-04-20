"use strict";

import { useState, useRef, useEffect } from "react";
import { profileValidation } from "./profileValidation.js";

export function changeUsername(username) {
  const [isEditingName, setIsEditingName] = useState(false);
  const inputRef = useRef(null);

  const {
    username: editName,
    setUsername: setEditName,
    errors,
    handleSubmit: validateName,
    resetValidation,
  } = profileValidation(username);

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus(); //this moves the mouse automatically into the input
      inputRef.current.select(); //select hihlights the text
    }
  }, [isEditingName]);

  function handleConfirm() {
    const isValid = validateName();
    if (!isValid) return false;

    setIsEditingName(false);
    return true;
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
