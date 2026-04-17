import { AvatarPreview } from "./avatar.jsx";
import { Icon } from "./icons.jsx";
import { useGame } from "../context/gameContext.jsx";

import "../styles/variable.css";
import "../styles/leaderboard.css";

export default function Leaderboard({ players = [] }) {
  const { players: contextPlayers = [] } = useGame();
  const activePlayers =
    Array.isArray(players) && players.length > 0 ? players : contextPlayers;

  const sortedPlayers = [...activePlayers].sort(
    (firstPlayer, secondPlayer) =>
      (secondPlayer.score ?? 0) - (firstPlayer.score ?? 0)
  );
  return (
    <div className="Leaderboard-box">
      <div className="row">
        <div className="col-12 col-lg-6 leaderboard-box-content-col">
          <div className="leaderboard-box-content">
            <div className="row">
              <div className="col-12 leaderboard-box-content-header">
                <h1>Leaderboard</h1>
              </div>
            </div>
            <div className="row">
              <div className="col-12 leaderboard-box-content-body">
                <div className="row">
                  <div className="col-4 leaderboard-box-content-body-left">
                    <div className="leaderboard-box-content-body-left-player">
                      <div className="leaderboard-box-content-body-left-player-avatar">
                        {sortedPlayers[1]?.avatar ? (
                          <AvatarPreview src={sortedPlayers[1].avatar} />
                        ) : (
                          <Icon name="anonymous" />
                        )}
                      </div>
                      <div className="leaderboard-box-content-body-left-player-name">
                        {sortedPlayers[1]?.name || "Player 2"}
                      </div>
                    </div>
                    <div className="leaderboard-box-content-body-left-graybox">
                      2º
                    </div>
                  </div>
                  <div className="col-4 leaderboard-box-content-body-center">
                    <div className="leaderboard-box-content-body-center-player">
                      <div className="leaderboard-box-content-body-center-player-avatar">
                        {sortedPlayers[0].avatar ? (
                          <AvatarPreview src={sortedPlayers[0].avatar} />
                        ) : (
                          <Icon name="anonymous" />
                        )}
                      </div>
                      <div className="leaderboard-box-content-body-center-player-name">
                        {sortedPlayers[0].name || "Player 1"}
                      </div>
                    </div>
                    <div className="leaderboard-box-content-body-center-yellowbox">
                      1º
                    </div>
                  </div>
                  <div className="col-4 leaderboard-box-content-body-right">
                    <div className="leaderboard-box-content-body-right-player">
                      <div className="leaderboard-box-content-body-right-player-avatar">
                        {sortedPlayers[2].avatar ? (
                          <AvatarPreview src={sortedPlayers[2].avatar} />
                        ) : (
                          <Icon name="anonymous" />
                        )}
                      </div>
                      <div className="leaderboard-box-content-body-right-player-name">
                        {sortedPlayers[2].name || "Player 3"}
                      </div>
                    </div>
                    <div className="leaderboard-box-content-body-right-brownbox">
                      3º
                    </div>
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
