import { Link } from "react-router-dom";
import { Icon } from "./icons.jsx";

export default function Button({ link, text }) {
  return (
    <button>
      <Link to={link}>{text}</Link>
    </button>
  );
}

export function GameButton({ className, link, path }) {
  return (
    <button className="game-button">
      <Link to={link}>
        <Icon className={className} name={path} />
      </Link>
    </button>
  );
}

export function UploadButton({ onClick }) {
  return (
    /* stopPropagation so to not escape to the parents */
    <button className="upload-button" onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <Icon name="upload" />
    </button>
  );
}
