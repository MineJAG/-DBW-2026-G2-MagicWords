import { createContext, useContext, useState, useCallback, useRef } from "react";
import { useWordValidation } from "../hooks/useWordValidation.js";
import { calculateWordScore } from "../lib/scoring.js";
import { getTimeLeft, getTimerEnd } from "../lib/timeUtils.js";

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [masterWord, setMasterWord] = useState("");
  const [timeMax, setTimeMax] = useState(600);
  const [timeStarted, setTimeStarted] = useState(null);
  const [timerEnd, setTimerEnd] = useState(null);
  const [gameStatus, setGameStatus] = useState("waiting"); // waiting, playing, finished
  const [winner, setWinner] = useState(null);
  const [isPublic, setIsPublic] = useState(null); // true = public, false = private
  const [submittedWords, setSubmittedWords] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const input = useRef(null);

  const { word, setWord, errors, handleSubmit } = useWordValidation(masterWord, submittedWords);

  const submitWord = useCallback((value) => {
    if (!value) return;
    const normalized = value.trim().toUpperCase();

    setSubmittedWords((prev) => [...prev, normalized]);

    const points = calculateWordScore(
      normalized,
      getTimeLeft(timerEnd),
      { totalTime: timeMax }
    );

    setPlayerScore((prev) => prev + points);
  }, [timeMax, timerEnd]);

  const onValid = useCallback((validWord) => {
    submitWord(validWord);
    setWord("");
  }, [submitWord, setWord]);

  function startTimer(duration = timeMax) {
    const nextTimeStarted = Date.now();
    const nextTimerEnd = getTimerEnd(nextTimeStarted, duration);

    setTimeStarted(nextTimeStarted);
    setTimerEnd(nextTimerEnd);
  }

  function resetTimer() {
    setTimeStarted(null);
    setTimerEnd(null);
    setMasterWord("");
    setSubmittedWords([]);
    setPlayerScore(0);
  }

  function changeWord(changeCount = 1) {
    const nextWordNumber = Math.max(1, changeCount);
    setMasterWord(`WORD${nextWordNumber}`);
  }

  return (
    <GameContext.Provider
      value={{
        masterWord,
        timeMax,
        setTimeMax,
        timeStarted,
        setTimeStarted,
        timerEnd,
        setTimerEnd,
        startTimer,
        resetTimer,
        changeWord,
        gameStatus,
        setGameStatus,
        winner,
        setWinner,
        isPublic,
        setIsPublic,
        submittedWords,
        setSubmittedWords,
        playerScore,
        setPlayerScore,
        submitWord,
        word,
        input,
        setWord,
        errors,
        handleSubmit,
        onValid,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
