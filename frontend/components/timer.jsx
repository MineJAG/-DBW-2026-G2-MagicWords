import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "./icons.jsx";
import { countdown, formatTimeLeft } from "../hooks/timer.js";

export default function Timer({
  timerEnd,
  link = "/home",
  className,
  iconClassName,
}) {
  const navigate = useNavigate();
  const timeLeft = countdown({ timerEnd });

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
