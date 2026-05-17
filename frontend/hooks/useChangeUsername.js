"use strict";

import { useRef, useEffect, useState } from "react";
import { useProfileValidation } from "./useProfileValidation.js";
import { useUser } from "../context/userContext.jsx";
import { api } from "../lib/api.js";

/**
 * Inline-rename flow for the profile username field. Wraps
 * {@link useProfileValidation} with edit-mode state, auto-focus/select on
 * entering edit mode, and a confirm handler that calls the API and refreshes
 * the user context. On 400/409 the server-side errors are surfaced through
 * the validation hook so the field can show them.
 *
 * @param {string} username - The current (saved) username.
 * @returns {{
 *   isEditingName: boolean,
 *   inputRef: React.RefObject<HTMLInputElement>,
 *   editName: string,
 *   setEditName: (value: string) => void,
 *   errors: Record<string, string>,
 *   handleConfirm: () => Promise<boolean>,
 *   handleCancel: () => void,
 *   handleStartEditing: () => void,
 * }}
 */
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
