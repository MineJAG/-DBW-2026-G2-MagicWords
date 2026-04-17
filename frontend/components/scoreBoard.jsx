import { Icon } from "./icons.jsx";
import sortScore from "../hooks/sortScoreboard.js";

export default function ScoreBoard({ players }) {
  const sortedPlayers = sortScore(players);

  return (
    <aside className="scoreboard">
      <div className="scoreboard-title">Scoreboard</div>
      <div className="scoreboard-list">
        {sortedPlayers.map((player, index) => (
          <div key={player.id ?? index} className="scoreboard-player-card">
            <div className="scoreboard-score">{player.score ?? 0}</div>
            <div className="scoreboard-avatar">
              {player.avatar ? (
                <img src={player.avatar} alt={`${player.name} avatar`} />
              ) : (
                <Icon className="scoreboard-avatar-icon" name="anonymous" />
              )}
            </div>
            <div className="scoreboard-name">{player.name}</div>
          </div>
        ))}
      </div>
    </aside>
  );
}