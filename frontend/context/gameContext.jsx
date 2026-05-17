import { createContext, useContext, useState, useCallback, useRef } from "react";
import { useWordValidation } from "../hooks/useWordValidation.js";
import { getTimerEnd } from "../lib/timeUtils.js";

const GameContext = createContext(null);

/**
 * Holds everything about the current round: the masterword, the timer, the
 * player's score, and the words they've already submitted. Also exposes the
 * word-input helpers from `useWordValidation`.
 *
 * Use `resetTimer()` to clear round data between rounds.
 *
 * @param {{ children: import("react").ReactNode }}
 * @returns {JSX.Element}
 */
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

  /**
   * Add a word to the list of submitted words. Empty input is ignored. The
   * word is trimmed and turned into uppercase before being saved.
   *
   * @param {string} value
   * @returns {void}
   */
  const submitWord = useCallback((value) => {
    if (!value) return;
    const normalized = value.trim().toUpperCase();
    setSubmittedWords((prev) => [...prev, normalized]);
  }, []);

  /**
   * Runs after the server says a word is valid. Adds the word to the list
   * and updates the player's score.
   *
   * @param {string} validWord - The word the server accepted.
   * @param {number} [currentScore] - The new score from the server.
   * @returns {void}
   */
  const onValid = useCallback((validWord, currentScore) => {
    submitWord(validWord);
    setPlayerScore(currentScore ?? 0);
  }, [submitWord]);

  /**
   * Start the round timer. Saves when the round started and works out when
   * it should end.
   *
   * @param {number} [duration=timeMax] - How long the round lasts, in seconds.
   * @returns {void}
   */
  function startTimer(duration = timeMax) {
    const nextTimeStarted = Date.now();
    const nextTimerEnd = getTimerEnd(nextTimeStarted, duration);

    setTimeStarted(nextTimeStarted);
    setTimerEnd(nextTimerEnd);
  }

  /**
   * Wipe the round: clears the timer, the big word, the submitted words,
   * and the score. Call this between rounds.
   *
   * @returns {void}
   */
  function resetTimer() {
    setTimeStarted(null);
    setTimerEnd(null);
    setMasterWord("");
    setSubmittedWords([]);
    setPlayerScore(0);
  }

  return (
    <GameContext.Provider
      value={{
        masterWord,
        setMasterWord,
        timeMax,
        setTimeMax,
        timeStarted,
        setTimeStarted,
        timerEnd,
        setTimerEnd,
        startTimer,
        resetTimer,
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

/**
 * Hook to read the game state from any component.
 *
 * @returns {{
 *   masterWord: string,                                                                            // the big word for this round
 *   setMasterWord: (v: string) => void,
 *   timeMax: number,                                                                               // round length in seconds
 *   setTimeMax: (v: number) => void,
 *   timeStarted: number | null,                                                                    // when the round began (ms)
 *   setTimeStarted: (v: number | null) => void,
 *   timerEnd: number | null,                                                                       // when the round ends (ms)
 *   setTimerEnd: (v: number | null) => void,
 *   startTimer: (duration?: number) => void,
 *   resetTimer: () => void,
 *   gameStatus: "waiting" | "playing" | "finished",
 *   setGameStatus: (v: string) => void,
 *   winner: object | null,                                                                         // who won, once the round ends
 *   setWinner: (v: object | null) => void,
 *   isPublic: boolean | null,                                                                      // is the room public?
 *   setIsPublic: (v: boolean | null) => void,
 *   submittedWords: string[],                                                                      // words already played
 *   setSubmittedWords: (v: string[]) => void,
 *   playerScore: number,
 *   setPlayerScore: (v: number) => void,
 *   submitWord: (value: string) => void,
 *   word: string,                                                                                  // current input value
 *   input: import("react").RefObject<HTMLInputElement>,                                            // ref for the input field
 *   setWord: (v: string) => void,
 *   errors: { word?: string },                                                                     // input errors
 *   handleSubmit: (event: Event, onValid?: Function, payload?: object) => Promise<void>,
 *   onValid: (validWord: string, currentScore?: number) => void,
 * }}
 */
export function useGame() {
  return useContext(GameContext);
}
