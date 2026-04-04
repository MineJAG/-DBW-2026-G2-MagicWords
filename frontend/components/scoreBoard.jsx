import { Icon } from "./icons.jsx";

export default function ScoreBoard({players}) {
  const sorted = players.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  return (
    <div className="scoreboard">
      <div className="scoreboard-header">
        <h2>Scoreboard</h2>
      </div>
      <ul className="scoreboard-list">
        {sorted.map((player, index) => (
          <li key={player.id ?? index} className="scoreboard-row">
              <div className="scoreboard-score">{player.score ?? 0}</div>
              <div className="player-avatar">
                {player.avatar ? (
                  <img src={player.avatar}/>
                ) : (
                  <Icon name="anonymous" />
                )}
              </div>
              <div className="scoreboard-name">
                {player.name}
              </div>
          </li>
        ))}
      </ul>
    </div>
  );
}