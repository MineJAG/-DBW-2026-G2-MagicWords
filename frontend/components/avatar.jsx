import {AvatarButton } from "./button.jsx";
import Image from "./images.jsx";

export default function Avatar({ src, alt = "avatar" }) {
  return (
    <div className="avatar-wrapper">
      <div className="avatar-circle">
        <Image name={src} className="avatar-img" />
        <AvatarButton />
      </div>
    </div>
  );
}