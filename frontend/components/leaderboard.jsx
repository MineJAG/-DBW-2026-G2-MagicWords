import { AvatarPreview } from "./avatar.jsx";
import { Icon } from "./icons.jsx";

import "../styles/variable.css";
import "../styles/leaderboard.css";

export default function Leaderboard({ players = [] }) {
  const sortedPlayers = [...players].sort(
    (firstPlayer, secondPlayer) =>
      (secondPlayer.score ?? 0) - (firstPlayer.score ?? 0)
  );

  const second = sortedPlayers[1] ?? null;
  const first = sortedPlayers[0] ?? null;
  const third = sortedPlayers[2] ?? null;

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
                        {second?.avatar ? (
                          <AvatarPreview src={second.avatar} />
                        ) : (
                          <Icon name="anonymous" />
                        )}
                      </div>
                      <div className="leaderboard-box-content-body-left-player-name">
                        {second?.name || "Player 2"}
                      </div>
                    </div>
                    <div className="leaderboard-box-content-body-left-graybox">
                      2º
                    </div>
                  </div>
                  <div className="col-4 leaderboard-box-content-body-center">
                    <div className="leaderboard-box-content-body-center-player">
                      <div className="leaderboard-box-content-body-center-player-avatar">
                        {first.avatar ? (
                          <AvatarPreview src={first.avatar} />
                        ) : (
                          <Icon name="anonymous" />
                        )}
                      </div>
                      <div className="leaderboard-box-content-body-center-player-name">
                        {first.name || "Player 1"}
                      </div>
                    </div>
                    <div className="leaderboard-box-content-body-center-yellowbox">
                      1º
                    </div>
                  </div>
                  <div className="col-4 leaderboard-box-content-body-right">
                    <div className="leaderboard-box-content-body-right-player">
                      <div className="leaderboard-box-content-body-right-player-avatar">
                        {third.avatar ? (
                          <AvatarPreview src={third.avatar} />
                        ) : (
                          <Icon name="anonymous" />
                        )}
                      </div>
                      <div className="leaderboard-box-content-body-right-player-name">
                        {third.name || "Player 3"}
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
