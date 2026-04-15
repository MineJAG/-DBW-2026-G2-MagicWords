import { Icon } from "./icons.jsx";

export default function ScoreBoard({ players }) {
  const sorted = players.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  return (
    <div className="scoreboard">
      <div className="row">
        <div className="col-12">
          <div className="scoreboard-title">Scoreboard</div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="scoreboard-list">
            {sorted.map((player, index) => (
              <div key={player.id ?? index} className="row">
                <div className="col-2">
                  <div className="scoreboard-score">{player.score ?? 0}</div>
                </div>
                <div className="col-3">
                  <div className="player-avatar">
                    {player.avatar ? (
                      <img src={player.avatar} />
                    ) : (
                      <Icon name="anonymous" />
                    )}
                  </div>
                </div>
                <div className="col-7">
                  <div className="scoreboard-name">{player.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
