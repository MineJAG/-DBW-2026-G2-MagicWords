import Navbar from "../components/navbar.jsx";
import Leaderboard from "../components/leaderboard.jsx";
import "../styles/variable.css";
import "../styles/leaderboardmultiplayer.css";
import { useGame } from "../context/gameContext.jsx";
import Button from "../components/button.jsx";


export default function LeaderboardMultiplayer() {
  const {
    players,
  } = useGame();

  return (
    <div className="Leaderboard">
      <Navbar />
      <div className="container-fluid leaderboard-container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-6 leaderboard-content-col">
            <div className="leaderboard-content">
              <Leaderboard players={players} />
            </div>
            <div className="return">
              <Button link="/waitingroom" text="return to room" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
