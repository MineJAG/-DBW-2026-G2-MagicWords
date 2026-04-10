import { useState } from "react";
import Navbar from "../components/navbar.jsx";
import Avatar from "../components/avatar.jsx";
import { ContentBoxBig } from "../components/contentBox.jsx";

import "../styles/variable.css";
import "../styles/profile.css";

export default function Profile() {
  const [user, setUser] = useState({
    name: "John Doe",
    picture: <Avatar />,
    stats: {
      gamesPlayed: 100,
      highestScore: 5000,
      gamesWon: 50,
      gamesLost: 50,
      winRate: 50,
    },
  });

  return (
    <>
      <div className="profile-page">
        <Navbar />
        <div className="m-4 text-center">
          <h1 className="display-3 fw-medium">Profile</h1>
        </div>

        <div>
          <div className="text-center m-2">
            <h1 className="display-5 fw-medium">Overall Performance</h1>
          </div>

          <div className="m-1 d-flex flex-nowrap justify-content-center">
            <ContentBoxBig
              content1={
                <>
                  <table className="stats-table">
                    <thead>
                      <tr>
                        <th>Stats</th>
                        <th>Values</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td>Games Played</td>
                        <td>{user.stats.gamesPlayed}</td>
                      </tr>
                      <tr>
                        <td>Highest Score</td>
                        <td>{user.stats.highestScore}</td>
                      </tr>
                      <tr>
                        <td>Games Won</td>
                        <td>{user.stats.gamesWon}</td>
                      </tr>
                      <tr>
                        <td>Games Lost</td>
                        <td>{user.stats.gamesLost}</td>
                      </tr>
                      <tr>
                        <td>Win Rate</td>
                        <td>{user.stats.winRate}%</td>
                      </tr>
                    </tbody>
                  </table>
                </>
              }
              content2={<Avatar />}
              size="text-container-profile-size"
            />
          </div>
        </div>
      </div>
    </>
  );
}
