import Navbar from "../components/navbar.jsx";
import ScoreBoard from "../components/scoreBoard.jsx";
import Keyboard from "../components/keyboard.jsx";
import { Icon } from "../components/icons.jsx";

import "../styles/variable.css";
import "../styles/scoreBoard.css";
import "../styles/multiplayer.css";

const players = [
  { id: 1, name: "player1", score: 1234, avatar: null },
  { id: 2, name: "player2", score: 1180, avatar: null },
  { id: 3, name: "player3", score: 1102, avatar: null },
  { id: 4, name: "player4", score: 945, avatar: null },
  { id: 5, name: "player5", score: 880, avatar: null },
  { id: 6, name: "player6", score: 810, avatar: null },
];

export default function Multiplayer() {
  const gameMode = "Normal";
  const timer = "10:00";
  const word = "WORD";
  const writtenWords = ["forest", "magic", "storm", "planet", "shadow"];
  const input = "";

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
                    <span className="multiplayer-status-mode">{gameMode}</span>
                    <span className="multiplayer-status-time">
                      <Icon className="multiplayer-status-icon" name="timer" />
                      <span>{timer}</span>
                    </span>
                  </div>
                </div>

                <div className="col-12">
                  <div className="multiplayer-center">
                    <h1 className="multiplayer-word">{word}</h1>
                  </div>
                </div>

                <div className="col-12">
                  <div className="multiplayer-written-box">
                    <p className="multiplayer-written-title">Words already used</p>
                    <div className="multiplayer-written-list">
                      {writtenWords.map((writtenWord) => (
                        <span key={writtenWord} className="multiplayer-written-chip">
                          {writtenWord}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <input
                    className="multiplayer-input"
                    type="text"
                    defaultValue={input}
                    placeholder="Type your word here"
                  />
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
