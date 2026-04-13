import { useRef, useState } from "react";
import { UploadButton } from "./button.jsx";
import { Icon } from "./icons.jsx";

export function Avatar({ src, alt = "Profile picture" }) {
  const [user, setUser] = useState({ picture: src || null });
  const [fileName, setFileName] = useState("");
  const inputRef = useRef(null);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUser((prev) => ({ ...prev, picture: ev.target.result }));
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="avatar-wrapper">
      <div className="avatar-circle" onClick={() => inputRef.current.click()}>
        {user.picture ? (
          <img src={user.picture} alt={alt} className="avatar-img" />
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
    </div>
  );
}

export function AvatarPreview({ src, alt = "Profile picture" }) {
  const isElement = typeof src === "object" && src !== null;

  return (
    <div className="avatar-wrapper">
      <div className="avatar-circle">
        {src ? (
          isElement ? (
            src
          ) : (
            <img src={src} alt={alt} className="avatar-img" />
          )
        ) : (
          <div className="avatar-fallback">
            <Icon name="anonymous" className="avatar-fallback-icon" />
          </div>
        )}
      </div>
    </div>
  );
}