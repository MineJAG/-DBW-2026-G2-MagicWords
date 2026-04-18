export function validateWaitingRoomTimer(minutes) {
  const parsedMinutes = Number(minutes);

  if (!Number.isFinite(parsedMinutes) || parsedMinutes <= 1) {
    return "Enter a number greater than 1.";
  }

  return "";
}

export function setWaitingRoomTimer({
  minutes,
  setMinutes,
  setTimeMax,
  setTimeLeft,
}) {
  const validationError = validateWaitingRoomTimer(minutes);
  if (validationError) {
    return validationError;
  }

  const nextMinutes = Number(minutes);
  const nextTime = nextMinutes * 60;

  setMinutes(String(nextMinutes));
  setTimeMax(nextTime);
  setTimeLeft(nextTime);

  return "";
}
