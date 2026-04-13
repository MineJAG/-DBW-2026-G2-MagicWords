import Navbar from "../components/navbar.jsx";
import { useState } from "react";
import  Avatar from "../components/avatar.jsx";
import { Icon } from "../components/icons.jsx";

import "../styles/variable.css";
import "../styles/leaderboardSingleplayer.css";

export default function LeaderboardSinglePlayer() {
      const [user, setUser] = useState({
        name: "John Doe",
        picture: null,
        stats: {
          currentScore: 0,
          gamesPlayed: 100,
          highestScore: 5000,
          gamesWon: 175,
          gamesLost: 50,
          winRate: 50,
          totalWordsFound: 1200,
          longestWordFound: "Chipingongo",
          averageWordLength: 6.5,
          mostWordsInOneMatch: 15,
          longestStreak: 10,
        },
      });
  return (
    <div className="Leaderboard">
      <Navbar />
      <div className="container-fluid leaderboard-container">
        <div className="row">
            <div className="col-6 leaderboard-content-score">
                <div className="row">
                <div className="col-12">
                    <div className="leaderboard-content-score-value">
                        Score: {user.stats.currentScore}  
                    </div>
                    <div className="leaderboard-content-score-yellowbox"></div>
                </div>
                </div>
            </div>
            <div className="col-6 leaderboard-content-stats">
                <div className="leaderboard-content-stats-title"> LeaderBoard-Singleplayer</div>
                <div className="row">
                    <div className="col-6 leaderboard-content-stats-user-Avatar">
                        {user.picture ? (
                            <Avatar src={user.picture}/>
                        ) : (
                            <Icon name="anonymous" />
                        )}
                    </div>
                    <div className="col-6 leaderboard-content-stats-user-name">
                        {user.name}
                    </div>
                </div>
                <div className="leaderboard-content-stats-list">
                {Object.entries(user.stats).map(([key, value]) => (
                    <div key={key} className="leaderboard-content-stats-item">
                        <strong>{key.replace(/([A-Z])/g, ' $1')}:</strong> {value}
                    </div>
                ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
