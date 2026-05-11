import { useEffect, useMemo } from "react";
import { useGame } from "../context/gameContext.jsx";
import { useRoom } from "../context/roomContext.jsx";
import { useWordRotation } from "../hooks/useWordRotation.js";
import { socket } from "../lib/socket.js";

import Navbar from "../components/navbar.jsx";
import ScoreBoard from "../components/scoreBoard.jsx";
import Keyboard from "../components/keyboard.jsx";
import Timer from "../components/timer.jsx";

import "../styles/variable.css";
import "../styles/scoreBoard.css";
import "../styles/multiplayer.css";

export default function Multiplayer() {
  const {
    masterWord,
    timerEnd,
    timeMax,
    changeWord,
    submittedWords,
    playerScore,
    word,
    input,
    setWord,
    errors,
    handleSubmit,
    onValid,
  } = useGame();
  const { roomPlayers } = useRoom();

  useWordRotation({ timerEnd, timeMax, changeWord });

  useEffect(() => {
    input.current?.focus();
  }, [input]);

  const players = useMemo(
    () =>
      roomPlayers.map((player) =>
        player.socketId === socket.id ? { ...player, score: playerScore } : player
      ),
    [roomPlayers, playerScore]
  );

  return (
    <div className="multiplayer-page">
      <Navbar />

      <div className="container-fluid multiplayer-shell">
        <div className="row multiplayer-layout g-3 g-lg-4">
          <div className="col-12 col-lg-4 col-xl-3">
            <ScoreBoard players={players} />
          </div>
          <div className="col-12 col-lg-8 col-xl-9">
            <section className="multiplayer-stage">
              <div className="row g-3">
                <div className="col-12">
                  <div className="multiplayer-status">
                    <div className="multiplayer-status-mode">Multiplayer</div>
                    <Timer
                      className="multiplayer-status-time"
                      iconClassName="multiplayer-status-icon"
                      timerEnd={timerEnd}
                      link="/leaderboard-multiplayer"
                    />
                  </div>
                </div>

                <div className="col-12">
                  <div className="multiplayer-center">
                    <h1 className="multiplayer-word">{masterWord}</h1>
                  </div>
                </div>

                <div className="col-12">
                  <div className="multiplayer-written-box">
                    <p className="multiplayer-written-title">
                      Words already used
                    </p>
                    <div className="multiplayer-written-list">
                      {submittedWords.length === 0 ? (
                        <div className="multiplayer-written-chip">_</div>
                      ) : (
                        submittedWords.map((writtenWord) => (
                          <div
                            key={writtenWord}
                            className="multiplayer-written-chip"
                          >
                            {writtenWord}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <form onSubmit={(e) => handleSubmit(e, onValid)}>
                    <input
                      ref={input}
                      autoFocus
                      className="multiplayer-input"
                      type="text"
                      value={word}
                      onChange={(e) => setWord(e.target.value)}
                      placeholder="Type your word here"
                    />
                    <div className="error multiplayer-error">{errors.word}</div>
                  </form>
                </div>

                <div className="col-12">
                  <div className="multiplayer-keyboard">
                    <Keyboard />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
