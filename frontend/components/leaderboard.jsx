import Avatar from "./avatar";
import { Icon } from "./icons.jsx";

import "../styles/variable.css";
import "../styles/leaderboard.css";

export default function Leaderboard(players = []) {
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
                                    <div className="leaderboard-box-content-body-left-player-avatar">{players[0]?.avatar ? <Avatar src={players[0]?.avatar} /> : <Icon name="anonymous" />}</div>
                                    <div className="leaderboard-box-content-body-left-player-name">{players[0]?.name || "Player 1"}</div>
                                </div>
                                <div className="leaderboard-box-content-body-left-graybox">2º</div>
                            </div>
                            <div className="col-4 leaderboard-box-content-body-center">
                                <div className="leaderboard-box-content-body-center-player">
                                    <div className="leaderboard-box-content-body-center-player-avatar">{players[1]?.avatar ? <Avatar src={players[1]?.avatar} /> : <Icon name="anonymous" />}</div>
                                    <div className="leaderboard-box-content-body-center-player-name">{players[1]?.name || "Player 2"}</div>
                                </div>
                                <div className="leaderboard-box-content-body-center-yellowbox">1º</div>
                            </div>
                            <div className="col-4 leaderboard-box-content-body-right">
                                <div className="leaderboard-box-content-body-right-player">
                                    <div className="leaderboard-box-content-body-right-player-avatar">{players[2]?.avatar ? <Avatar src={players[2]?.avatar} /> : <Icon name="anonymous" />}</div>
                                    <div className="leaderboard-box-content-body-right-player-name">{players[2]?.name || "Player 3"}</div>
                                </div>
                                <div className="leaderboard-box-content-body-right-brownbox">3º</div>
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
