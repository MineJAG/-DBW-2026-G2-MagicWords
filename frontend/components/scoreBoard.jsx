import { Icon } from "./icons.jsx";

export default function ScoreBoard({ players }) {
  const sortedPlayers = [...players].sort(
    (firstPlayer, secondPlayer) => (secondPlayer.score ?? 0) - (firstPlayer.score ?? 0)
  );

  return (
    <aside className="scoreboard">
      <div className="row g-0">
        <div className="col-12">
          <div className="scoreboard-title">Scoreboard</div>
        </div>
      </div>

      <div className="row g-0">
        <div className="col-12">
          <div className="scoreboard-list">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id ?? index}
                className="scoreboard-player-card row align-items-center g-2"
              >
                <div className="col-3">
                  <div className="scoreboard-score">{player.score ?? 0}</div>
                </div>

                <div className="col-3">
                  <div className="scoreboard-avatar">
                    {player.avatar ? (
                      <img src={player.avatar} alt={`${player.name} avatar`} />
                    ) : (
                      <Icon className="scoreboard-avatar-icon" name="anonymous" />
                    )}
                  </div>
                </div>

                <div className="col-6">
                  <div className="scoreboard-name">{player.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
