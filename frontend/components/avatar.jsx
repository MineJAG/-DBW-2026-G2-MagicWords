import { useRef, useState } from "react";
import { UploadButton } from "./button.jsx";
import { Icon } from "./icons.jsx";

export default function Avatar({ src, alt = "Profile picture" }) {
  const [imgSrc, setImgSrc] = useState(src || null);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef(null);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImgSrc(ev.target.result);
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="avatar-wrapper">
      <div className="avatar-circle" onClick={() => inputRef.current.click()}>
        {imgSrc ? (
          <img src={imgSrc} alt={alt} className="avatar-img" />
        ) : (
          <div className="avatar-fallback">
            <Icon name="anonymous" className="avatar-fallback-icon" />
          </div>
        )}

        <UploadButton onClick={() => inputRef.current.click()} />
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="avatar-input"
        onChange={handleFileChange}
      />

      {fileName && <p className="avatar-filename">{fileName}</p>}
    </div>
  );
}
