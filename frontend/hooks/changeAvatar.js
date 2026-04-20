"use strict";

import { useRef, useState } from "react";

export default function useAvatar(initialSrc = null) {
  const [picture, setPicture] = useState(initialSrc);
  const inputRef = useRef(null);

  function handleFileChange(e) {
    //this is what handles the image change
    const file = e.target.files[0]; //the selected files are stored in a list so we take the first one
    if (!file) return; //if no file is selected, return

    const reader = new FileReader(); //file reader is a converter

    reader.onload = (event) => {
      setPicture(event.target.result);
    };

    reader.readAsDataURL(file);
  }

  function openFilePicker() {
    //this serves to open the folders so u can select the image
    inputRef.current.click();
  }

  return {
    picture,
    inputRef,
    handleFileChange,
    openFilePicker,
  };
}
