import { useState, useRef, useEffect } from "react";

import { profileValidation } from "../hooks/profileValidation.js";

import { useUser } from "../context/userContext.jsx";

import Navbar from "../components/navbar.jsx";
import { ContentBoxBig } from "../components/contentBox.jsx";
import DoughnutChart from "../components/doughnutChart.jsx";
import RadarChart from "../components/radarChart.jsx";
import { Avatar } from "../components/avatar.jsx";
import { Icon } from "../components/icons.jsx";

import "../styles/variable.css";
import "../styles/profile.css";

export default function Profile() {
  const { user } = useUser();

  const [isEditingName, setIsEditingName] = useState(false);
  const inputRef = useRef(null);

  const {
    username: editName,
    setUsername: setEditName,
    errors,
    handleSubmit: validateName,
    resetValidation,
  } = profileValidation(user?.name);

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  function handleConfirm() {
    const isValid = validateName();
    if (!isValid) return;

    setIsEditingName(false);
  }

  function handleCancel() {
    resetValidation(user?.name);
    setIsEditingName(false);
  }

  return (
    <>
      <div className="profile-page">
        <Navbar />
        <div className="m-4 text-center">
          <h1 className="display-3 fw-medium">Profile</h1>
        </div>

        <div className="container-fluid">
          <div>
            <div className="row profile-top-row justify-content-center">
              <div className="col-lg-6 col-auto d-flex align-items-center justify-content-center">
                <div className="username-box d-flex flex-column align-items-center justify-content-center">
                  {isEditingName ? (
                    <div>
                      <div className="d-flex align-items-center">
                        <input
                          ref={inputRef}
                          type="text"
                          className="edit-name-input"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                        <span
                          className="edit-action-btn confirm-btn"
                          onClick={handleConfirm}
                        >
                          <Icon name="check" />
                        </span>
                        <span
                          className="edit-action-btn cancel-btn"
                          onClick={handleCancel}
                        >
                          <Icon name="close" />
                        </span>
                      </div>
                      <div className="error">{errors.username}</div>
                    </div>
                  ) : (
                    <div className="display-name-container">
                      <p className="fw-medium display-name-text">
                        {user?.name}
                      </p>
                      <span
                        className="edit-trigger-btn"
                        onClick={() => {
                          resetValidation(user?.name);
                          setIsEditingName(true);
                        }}
                      >
                        <Icon name="edit" />
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-lg-6 col-auto d-flex align-items-center justify-content-center">
                <Avatar src={user?.picture} />
              </div>
            </div>
          </div>

          <div className="m-top">
            <div className="text-center m-2">
              <h1 className="display-5 fw-medium">Overall Performance</h1>
            </div>

            <div className="m-0 d-flex flex-nowrap justify-content-center">
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
                          <td>{user?.stats.gamesPlayed}</td>
                        </tr>
                        <tr>
                          <td>Highest Score</td>
                          <td>{user?.stats.highestScore}</td>
                        </tr>
                        <tr>
                          <td>Games Won</td>
                          <td>{user?.stats.gamesWon}</td>
                        </tr>
                        <tr>
                          <td>Games Lost</td>
                          <td>{user?.stats.gamesLost}</td>
                        </tr>
                        <tr>
                          <td>Win Rate</td>
                          <td>{user?.stats.winRate}%</td>
                        </tr>
                      </tbody>
                    </table>
                  </>
                }
                content2={<DoughnutChart stats={user?.stats} />}
                size="text-container-profile-size"
              />
            </div>
          </div>

          <div className="m-top">
            <div className="text-center m-2">
              <h1 className="display-5 fw-medium">Word Mastery</h1>
            </div>

            <div className="m-0 d-flex flex-nowrap justify-content-center">
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
                          <td>Total Words Found</td>
                          <td>{user?.stats.totalWordsFound}</td>
                        </tr>
                        <tr>
                          <td>Longest Word Found</td>
                          <td>{user?.stats.longestWordFound}</td>
                        </tr>
                        <tr>
                          <td>Average Word Length</td>
                          <td>{user?.stats.averageWordLength}</td>
                        </tr>
                        <tr>
                          <td>Most Words in One Match</td>
                          <td>{user?.stats.mostWordsInOneMatch}</td>
                        </tr>
                        <tr>
                          <td>Longest Streak</td>
                          <td>{user?.stats.longestStreak}</td>
                        </tr>
                      </tbody>
                    </table>
                  </>
                }
                content2={<RadarChart stats={user?.stats} />}
                size="text-container-profile-size"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
