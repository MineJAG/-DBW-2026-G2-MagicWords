import { useRoom } from "../context/roomContext.jsx";
import { setWaitingRoomTimer } from "../lib/timeSetter.js";
import { useRoomActions } from "../hooks/useRoomActions.js";
import { useWaitingRoom } from "../hooks/useWaitingRoom.js";

import Navbar from "../components/navbar.jsx";
import { Icon } from "../components/icons.jsx";
import { ClickableButton } from "../components/button.jsx";

import "../styles/variable.css";
import "../styles/waitingroom.css";



export default function WaitingRoom() {
  const { room, roomPlayers, loading, error: roomError } = useRoom();
  const { kickPlayer, startRoom } = useRoomActions();
  const {
    timeMax,
    setTimeMax,
    minutes,
    setMinutes,
    timerError,
    setTimerError,
    hostSocketId,
    currentSocketIsHost,
  } = useWaitingRoom();

  return (
    <div className="waiting-room-page">
      <Navbar />
      <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-12">
          <h1 className="header">Waiting Room - {room} </h1>
          {roomError ? <div className="text-danger text-center mb-3">{roomError}</div> : null}

          <div className="row justify-content-center">
            <div className="col-12 col-lg-6">
              <div className="player-list">
                {roomPlayers.map((player) => (
                  <div key={player.socketId ?? player.name} className="player">
                    <div className="row align-items-center w-100">
                      <div className="col-3 col-md-2">
                        <div className="player-avatar">
                          {player.picture ? (
                            <img
                              src={player.picture}
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
                        {player.socketId === hostSocketId ? (
                          <div className="player-host">
                            <Icon name="star" />
                          </div>
                        ) : (
                          <div
                            className="player-not-host"
                            onClick={currentSocketIsHost ? () => kickPlayer(player.socketId) : undefined}
                          >
                            {currentSocketIsHost ? <Icon name="close" /> : null}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {currentSocketIsHost ? (
                  <>
                    <div className="col-12 timer">
                      <div className="timer-input-row">
                        <div className="timer-label">Time(min):</div>
                        <input
                          className="timer-input"
                          type="text"
                          inputMode="numeric"
                          placeholder={String(timeMax / 60)}
                          value={minutes}
                          onChange={(e) => {
                            setMinutes(e.target.value.replace(/\D/g, ""));
                            setTimerError("");
                          }}
                        />
                        <button
                          type="button"
                          className="timer-set-button"
                          disabled={!currentSocketIsHost}
                          onClick={() => {
                            const error = setWaitingRoomTimer({
                              minutes,
                              setMinutes,
                              setTimeMax,
                            });

                            setTimerError(error);
                          }}
                        >
                          Set
                        </button>
                      </div>
                      {timerError ? (
                        <div className="text-danger mt-2">{timerError}</div>
                      ) : null}
                    </div>
                    <div className="col-12 startButton">
                      <ClickableButton
                        disabled={loading || !currentSocketIsHost}
                        onClick={() => {
                          setTimerError("");
                          const error = setWaitingRoomTimer({
                            minutes,
                            setMinutes,
                            setTimeMax,
                          });

                          if (error) {
                            setTimerError(error);
                            return;
                          }

                          startRoom({ timeLimit: Number(minutes) * 60 });
                        }}
                        text="Start"
                      />
                    </div>
                  </>
                ) : null}
                  </div>
              </div>
            </div>
          </div>
      </div>
    </div>
    </div>
  );
}
