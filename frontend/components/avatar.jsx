import { useAvatar } from "../hooks/useAvatar.js";
import { UploadButton } from "./button.jsx";
import { Icon } from "./icons.jsx";

export function Avatar({ src, alt = "Profile picture" }) {
  const { picture, inputRef, handleFileChange, openFilePicker } = useAvatar(src);

  return (
    <div className="avatar-profile-size avatar-wrapper">
      <div className="avatar-circle" onClick={openFilePicker}>
        {picture ? (
          <img src={picture} alt={alt} className="avatar-img" />
        ) : (
          <div className="avatar-fallback">
            <Icon name="anonymous" className="avatar-fallback-icon" />
          </div>
        )}

        <UploadButton onClick={openFilePicker} />
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
    <div className="avatar-container-size avatar-wrapper">
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