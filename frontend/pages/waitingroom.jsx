import Navbar from "../components/navbar.jsx";
import { Icon } from "../components/icons.jsx";
import Button from "../components/button.jsx";

import "../styles/variable.css";
import "../styles/waitingroom.css";

import { useState } from "react";
import { AvatarPreview } from "../components/avatar.jsx";

export default function WaitingRoom() {
  const [roomCode] = useState("1234");

  const [players] = useState([
    {
      name: "Player 1",
      avatar: null,
      isHost: true,
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
      <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-12">
          <h1 className="header">Waiting Room - {roomCode}</h1>

          <div className="row justify-content-center">
            <div className="col-12 col-lg-6">
              <div className="player-list">
                {players.map((player) => (
                  <div key={player.name} className="player">
                    <div className="row align-items-center w-100">
                      <div className="col-3 col-md-2">
                        <div className="player-avatar">
                          {player.avatar ? (
                            <AvatarPreview
                              src={player.avatar}
                              alt={`${player.name} avatar`}
                            />
                          ) : (
                            <Icon name="anonymous" />
                          )}
                        </div>
                      </div>

                      <div className="col-7 col-md-8">
                        <div className="player-name">{player.name}</div>
                      </div>

                      <div className="col-2 text-center">
                        {player.isHost ? (
                          <div className="player-host">
                            <Icon name="star" />
                          </div>
                        ) : (
                          <div className="player-not-host">
                            <Icon name="close" onClick={() => {}} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="col-12 startButton">
                  <Button link="/Multiplayer" text="Create" />
                </div>
              </div>
              </div>
            </div>
          </div>
      </div>
    </div>
    </div>
  );
}