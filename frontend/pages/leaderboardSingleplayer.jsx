import { useUser } from "../context/userContext.jsx";
import { useGame } from "../context/gameContext.jsx";

import Navbar from "../components/navbar.jsx";
import { AvatarPreview } from "../components/avatar.jsx";
import { Icon } from "../components/icons.jsx";
import Button from "../components/button.jsx";

import "../styles/variable.css";
import "../styles/leaderboardSingleplayer.css";

export default function LeaderboardSinglePlayer() {
  const { user } = useUser();
  const { players } = useGame();
  const activePlayer = players.find((player) => player.isHost) ?? players[0];
  const currentScore = activePlayer?.score ?? user?.stats?.currentScore ?? 0;
  const userStats = user?.stats ?? {};

  return (
    <div className="Leaderboard">
      <Navbar />
      <div className="container-fluid leaderboard-container">
        <div className="row">
          <div className="col-6 leaderboard-content-score">
            <div className="row">
              <div className="col-12">
                <div className="leaderboard-content-score-value">
                  Score: {currentScore}
                </div>
                <div className="leaderboard-content-score-yellowbox"></div>
              </div>
            </div>
          </div>
          <div className="col-6 leaderboard-content-stats">
            <div className="leaderboard-content-stats-title">
              LeaderBoard-Singleplayer
            </div>
            <div className="row">
              <div className="col-6 leaderboard-content-stats-user-Avatar">
                {user?.picture ? (
                  <AvatarPreview src={user?.picture} />
                ) : (
                  <Icon name="anonymous" />
                )}
              </div>
              <div className="col-6 leaderboard-content-stats-user-name">
                {user?.name}
              </div>
            </div>
            <div className="leaderboard-content-stats-list">
              {Object.entries(userStats).map(([key, value]) => (
                <div key={key} className="leaderboard-content-stats-item">
                  <strong>{key.replace(/([A-Z])/g, " $1")}:</strong> {value}
                </div>
              ))}
            </div>
          </div>
          <Button link="/home" text="return" />
        </div>
      </div>
    </div>
  );
}
