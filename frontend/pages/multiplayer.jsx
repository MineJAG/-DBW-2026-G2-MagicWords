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
      <div className="layout">
        <aside><ScoreBoard players={players} /></aside>
        <div className="main">
          <div className="info">
            <div className="header">
              <div className="mode"> Multiplayer </div>
              <Icon name="Timer" />
              <div className="timer"> {timer} </div>
            </div>
            <h1 className="word">{word} </h1>
            <div className="usedWords">{helperText} </div>
            <div className="input-box">{input} </div>
            <div className="keyboard">
              <Keyboard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}