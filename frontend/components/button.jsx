import { Link } from "react-router-dom";
import { Icon } from "./icons.jsx";

export default function Button({ link, text, onClick }) {
  return (
    <button>
      <Link to={link} onClick={onClick}>{text}</Link>
    </button>
  );
}

export function ClickableButton({
  onClick,
  text,
  type = "button",
  className,
  disabled = false,
}) {
  return (
    <button
      type={type}
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export function UploadButton({ onClick }) {
  return (
    /* stopPropagation so to not escape to the parents */
    <button className="upload-button" onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <Icon name="edit" />
    </button>
  );
}
