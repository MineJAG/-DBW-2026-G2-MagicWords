import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "./icons.jsx";
import { useCountdown } from "../hooks/useCountdown.js";
import { formatTimeLeft } from "../lib/timeUtils.js";

export default function Timer({
  timerEnd,
  link = "/home",
  className,
  iconClassName,
}) {
  const navigate = useNavigate();
  const timeLeft = useCountdown(timerEnd);

  useEffect(() => {
    if (timerEnd && timeLeft === 0) {
      navigate(link, { replace: true });
    }
  }, [timerEnd, timeLeft, navigate, link]);

  return (
    <div className={className}>
      <Icon className={iconClassName} name="timer" />
      <div>{formatTimeLeft(timeLeft)}</div>
    </div>
  );
}
