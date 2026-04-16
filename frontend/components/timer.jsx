import { Icon } from "./icons.jsx";

function formatTimeLeft(timeLeft) {
  const time = Math.max(0, Math.floor(Number(timeLeft) || 0));
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function Timer({ timeLeft, className, iconClassName }) {
  return (
    <div className={className}>
      <Icon className={iconClassName} name="timer" />
      <div>{formatTimeLeft(timeLeft)}</div>
    </div>
  );
}
