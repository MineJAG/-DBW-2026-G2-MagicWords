import Navbar from "../components/navbar.jsx";
import Leaderboard from "../components/leaderboard.jsx";
import "../styles/variable.css";
import "../styles/leaderboardmultiplayer.css";

export default function LeaderboardMultiplayer() {
  return (
    <div className="Leaderboard">
      <Navbar />
      <div className="container-fluid leaderboard-container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-6 leaderboard-content-col">
            <div className="leaderboard-content">
            <Leaderboard players = {[]}/>
            <div className="leaderboard-content-text">
              Placeholder
              </div>
           </div>
          </div>
        </div>
      </div>
    </div>
  );
}
