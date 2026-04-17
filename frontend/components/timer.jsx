import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "./icons.jsx";
import { formatTimeLeft } from "../hooks/timer.js";

export default function Timer({
  timeLeft,
  setTimeLeft,
  link = "/home",
  className,
  iconClassName,
}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft <= 0) {
      navigate(link, { replace: true });
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, navigate, setTimeLeft, link]);

  return (
    <div className={className}>
      <Icon className={iconClassName} name="timer" />
      <div>{formatTimeLeft(timeLeft)}</div>
    </div>
  );
}
