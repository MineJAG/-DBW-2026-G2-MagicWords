import Navbar from "../components/navbar.jsx";
import { Image } from "../components/images.jsx";
import { Icon } from "../components/icons.jsx";

import "../styles/variable.css";

import { useState } from "react";

export default function WaitingRoom() {
  const [roomCode, setRoomCode] = useState("1234"); // Placeholder room code

  const [players, setPlayers] = useState([ // Placeholder player data
    {
      name: "Player 1",
      avatar: null,
      isHost: true, //placeholder, to be replaced with actual host logic just for testing purposes
    },
    {
      name: "Player 2",
      avatar: null,
      isHost: false,
    },
  ]);

  return (
    <div className="waiting-room-page">
      <Navbar />
      <div className="container text-center">
        <div>
          <h1 className="header">Waiting Room : {roomCode}</h1>
          <div className="player-list">
            {players.map((player, index) => (
              <div key={index} className="player">
                <div className="player-avatar">
                  {player.avatar ? (
                    <Image src={player.avatar}/>
                  ) : (
                    <Icon name="anonymous"/>
                  )}
                </div>
                <div className="player-name">{player.name}</div>
                {player.isHost && <div className="player-host">Host</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
