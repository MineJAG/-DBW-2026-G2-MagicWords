import { useState } from "react";
import { useRoom } from "../context/roomContext.jsx";
import { AvatarPreview } from "../components/avatar.jsx";
import { useGame } from "../context/gameContext.jsx";

import Navbar from "../components/navbar.jsx";
import { Icon } from "../components/icons.jsx";
import Button from "../components/button.jsx";

import "../styles/variable.css";
import "../styles/waitingroom.css";



export default function WaitingRoom() {
  const { room, roomPlayers } = useRoom();
  const { setTimeLeft } = useGame();
  const [minutes, setMinutes] = useState("10");

  return (
    <div className="waiting-room-page">
      <Navbar />
      <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-12">
          <h1 className="header">Waiting Room - {room} </h1>

          <div className="row justify-content-center">
            <div className="col-12 col-lg-6">
              <div className="player-list">
                {roomPlayers.map((player) => (
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
                <div className="col-12 timer">
                  <div className="timer-input-row">
                    <input
                      className="timer-input"
                      type="text"
                      inputMode="numeric"
                      placeholder="10"
                      value={minutes}
                      onChange={(e) => setMinutes(e.target.value)}
                    />
                    <button
                      type="button"
                      className="timer-set-button"
                      onClick={
                      !minutes ? setTimeLeft(10 * 60) : setTimeLeft(Number(minutes) * 60)
                      }
                    >
                      Set
                    </button>
                  </div>
                </div>
                <div className="col-12 startButton">
                  <Button link="/multiplayer" text="Create" onClick={() => {}} />
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
