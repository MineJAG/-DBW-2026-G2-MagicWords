import Chart from "chart.js/auto";
import Navbar from "../components/navbar.jsx";
import Avatar from "../components/avatar.jsx";
import { ContentBoxBig } from "../components/contentBox.jsx";

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
        <div className="m-1 text-center">
          <h2 className="fw-medium">Overall Performance</h2>
          <div>
            <ContentBoxBig content1={"Overall Performance"} content2={<Avatar />} />
          </div>
        </div>
      </div>
    </>
  );
}
