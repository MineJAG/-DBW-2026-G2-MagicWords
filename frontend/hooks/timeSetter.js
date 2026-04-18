export function setWaitingRoomTimer({
  minutes,
  setMinutes,
  setTimeMax,
  setTimeLeft,
}) {
  const parsedMinutes = Number(minutes);
  const nextMinutes = parsedMinutes > 0 ? parsedMinutes : 10;
  const nextTime = nextMinutes * 60;

  setMinutes(String(nextMinutes));
  setTimeMax(nextTime);
  setTimeLeft(nextTime);
}
