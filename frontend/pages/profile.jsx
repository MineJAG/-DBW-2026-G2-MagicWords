import Chart from 'chart.js/auto';
import Navbar from "../components/navbar.jsx";
import Avatar from "../components/avatar.jsx";

import "../styles/variable.css";
import "../styles/profile.css";

export default function Profile() {
  return (
    <>
      <div className="profile-page">
        <Navbar />
        <div className="m-4 text-center">
          <h1 className="display-4 fw-medium">Profile</h1>
        </div>
      </div>
    </>
  );
}
