"use strict";

import { useRef, useState } from "react";
import { useUser } from "../context/userContext.jsx";
import { api } from "../lib/api.js";

export default function useAvatar(initialSrc = null) {
  const { setUser } = useUser();
  const [picture, setPicture] = useState(initialSrc);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("File must be an image.");
      return;
    }

    const reader = new FileReader();

    reader.onload = async (event) => {
      const dataUrl = event.target.result;
      const previous = picture;

      setError(null);
      setPicture(dataUrl);

      try {
        const data = await api.updatePicture({ picture: dataUrl });
        setUser(data);
      } catch (err) {
        setPicture(previous);
        setError(err.errors?.picture || "Could not save picture.");
      }
    };

    reader.readAsDataURL(file);
  }

  function openFilePicker() {
    inputRef.current.click();
  }

  return {
    picture,
    error,
    inputRef,
    handleFileChange,
    openFilePicker,
  };
}
