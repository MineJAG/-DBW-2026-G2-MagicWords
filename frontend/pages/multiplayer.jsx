import Navbar from "../components/navbar.jsx";
import ScoreBoard from "../components/scoreBoard.jsx";
import Keyboard from "../components/keyboard.jsx";
import { Icon } from "../components/icons.jsx";

import "../styles/variable.css";
import "../styles/scoreBoard.css";
import "../styles/multiplayer.css";

const players = [
  { id: 1, name: "Player 1", score: 12, avatar: null },
  { id: 2, name: "Player 2", score: 3, avatar: null },
  { id: 3, name: "Player 3", score: 31, avatar: null },
];

export default function Multiplayer() {
  const timer = "10:00";
  const word = "WORD";
  const helperText = "already written words go here";
  const input = "";

  return (
    <div className="multiplayer-page">
      <Navbar />
      <div className="container-fluid multiplayer-container">
        <div className="row multiplayer-layout g-4">
          <div className="col-12 col-lg-3 col-xl-2">
            <ScoreBoard players={players} />
          </div>
          <div className="col-12 col-lg-9 col-xl-10">
            <section className="multiplayer-content">
              <div className="multiplayer-content-header">
                <div className="multiplayer-content-header-mode">
                  Multiplayer
                </div>
                <Icon className="multiplayer-content-header-icon" name="timer" />
                <div className="multiplayer-content-header-timer">{timer}</div>
              </div>
              <div className="multiplayer-content-word">{word}</div>
              <div className="multiplayer-content-helper">{helperText}</div>
              <inpit className="multiplayer-content-input">{input}</inpit>
            </section>
            <div className="multiplayer-content-keyboard">
              <Keyboard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
