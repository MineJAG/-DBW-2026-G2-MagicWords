import {Icon} from "./icons.jsx";

export default function Button({link, text}) {
  return (
    <button>
      <a href={link}>{text}</a>
    </button>
  );
}

export function GameButton({className, link, path}) {
  return (
    <button className="game-button">
      <a href={link}>
        <Icon className={className} path={path}/>
      </a>
    </button>
  );
}
