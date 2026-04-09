import Navbar from "../components/navbar.jsx";
import { ContentBoxBig, ContentBoxMedium } from "../components/contentBox.jsx";
import { Image } from "../components/images.jsx";
import { GameButton } from "../components/button.jsx";
import { Icon } from "../components/icons.jsx";

import "../styles/variable.css";
import "../styles/index.css";

export default function Index() {
  return (
    <div className="home-page">
      <Navbar />
      <div className="container-fluid">
        <div className="m-5 text-center">
          <h1 className="display-1 fw-medium">Magic Words</h1>
        </div>

        <div className="m-4 justify-content-center">
          <ContentBoxBig
            content1={
              <>
                <h3>Welcome back PLACEHOLDER.</h3>
                <p>
                  Check your progress, challenge other players, and improve your
                  score with every match.
                </p>
                <h4>Stats:</h4>
                <ul>
                  <li>Total Score:</li>
                  <li>Words Found:</li>
                  <li>Games Played:</li>
                  <li>Longest Word:</li>
                </ul>
              </>
            }
            content2={<Image name="placeholder" />}
          />
        </div>

        <div className="row align-content-center vh-50">
          <div className="col-6 d-flex justify-content-end">
            <ContentBoxMedium
              content1={
                <>
                  <h3>Multiplayer</h3>
                </>
              }
              content2={
                <>
                  <h4>How it Works</h4>
                  <p>
                    All players receive the same master word and compete in real
                    time.
                  </p>
                  <h4>Rules</h4>
                  <ul>
                    <li>Each player submits words independently.</li>
                    <li>Letters must exist in the word.</li>
                    <li>Words must exist in the dictionary.</li>
                    <li>There is a time limit.</li>
                    <li>Longer words give more points.</li>
                  </ul>
                  <h4>Objective</h4>
                  <p>
                    When the timer ends, the player with the highest score wins.
                  </p>
                </>
              }
              icon={<Icon className={"game-icon-box"} name={"multiplayer"} />}
            />
          </div>
          <div className="col-6 d-flex justify-content-start">
            <ContentBoxMedium
              content1={
                <>
                  <h3>Singleplayer</h3>
                </>
              }
              content2={
                <>
                  <h4>How it Works</h4>
                  <p>
                    You receive a master word and must find as many valid words
                    as possible hidden inside it.
                  </p>
                  <h4>Rules</h4>
                  <ul>
                    <li>Letters must exist in the word.</li>
                    <li>Words must exist in the dictionary.</li>
                    <li>There is no time limit.</li>
                    <li>Longer words give more points.</li>
                  </ul>
                  <h4>Objective</h4>
                  <p>
                    Score as many points as possible and beat your personal
                    best.
                  </p>
                </>
              }
              icon={<Icon className={"game-icon-box"} name={"singleplayer"} />}
            />
          </div>
        </div>

        <div className="row align-content-center">
          <div className="col-6 d-flex justify-content-end">
            <ContentBoxMedium
              content1={
                <>
                  <h3>Create Room</h3>
                </>
              }
              content2={
                <>
                  <h4>How Rooms Work</h4>
                  <p>
                    Creating a room lets you host a match and invite others to
                    join.By clicking the Create Room button, you can start a new
                    lobby and choose whether it will be Public or Private.
                  </p>{" "}
                  <h4>Rules</h4>
                  <ul>
                    <li>
                      Public Rooms are visible and open for anyone to join.
                    </li>
                    <li>
                      Private Rooms are accessible only through a unique game
                      code or invite link.
                    </li>
                  </ul>
                  <p>
                    Once created, simply send the code or link to your friends.
                  </p>
                </>
              }
              icon={<Icon className={"game-icon-box"} name={"home"} />}
            />
          </div>
          <div className="col-6 d-flex justify-content-start">
            <ContentBoxMedium
              content1={
                <>
                  <h3>Enter Code</h3>
                </>
              }
              content2={
                <>
                  <h4>How to Join Friends</h4>
                  <p>
                    Joining a game with friends is quick and easy. Use a shared
                    game code or open the invite link you received to connect
                    directly to the same match.
                  </p>
                  <p>
                    Enter the code in the join field and confirm, or simply tap
                    the invite link to be placed in your friend's lobby
                    automatically. Both options ensure you get into the game.
                    Make sure the code is entered correctly and that your
                    internet connection is stable.
                  </p>

                  <h4>Objective</h4>
                  <p>
                    Connect with your friends easily so you can jump straight
                    into the game together.
                  </p>
                </>
              }
              icon={<Icon className={"game-icon-box"} name={"code"} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
