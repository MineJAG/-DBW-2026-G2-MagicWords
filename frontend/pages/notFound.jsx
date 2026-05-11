import Navbar from "../components/navbar.jsx";
import Button from "../components/button.jsx";

import "../styles/variable.css";
import "../styles/leaderboardSingleplayer.css";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="container-fluid text-center">
        <div className="m-5">
          <h1 className="display-1 fw-medium">404</h1>
          <h2 className="fw-medium">Page Not Found</h2>
          <p>The page you're looking for doesn't exist or has been moved.</p>
        </div>
      </div>
    </>
  );
}
