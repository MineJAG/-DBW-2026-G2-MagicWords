import Navbar from "../components/navbar.jsx";
import { BigDisplay } from "../components/title.jsx";
import { ContentBoxBig, ContentBoxMedium } from "../components/contentBox.jsx";
import { Placeholder, Icon } from "../components/images.jsx";
import { GameButton } from "../components/button.jsx";

import "../styles/variable.css";
import "../styles/index.css";

export default function Index() {
  return (
    <div className="container-fluid">
      <Navbar />

      <div className="row m-5 text-center">
        <BigDisplay text="Magic Words" />
      </div>

      <div className="row m-4 justify-content-center">
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
          content2={<Placeholder />}
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
            icon={
              <Icon
                className={"game-icon-box"}
                path={
                  "M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"
                }
              />
            }
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
                  You receive a master word and must find as many valid words as
                  possible hidden inside it.
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
                  Score as many points as possible and beat your personal best.
                </p>
              </>
            }
            icon={
              <Icon
                className={"game-icon-box"}
                path={
                  "M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"
                }
              />
            }
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
                  <li>Public Rooms are visible and open for anyone to join.</li>
                  <li>
                    Private Rooms are accessible only through a unique game code
                    or invite link.
                  </li>
                </ul>
                <p>
                  Once created, simply send the code or link to your friends.
                </p>
              </>
            }
            icon={
              <Icon
                className={"game-icon-box"}
                path={
                  "M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"
                }
              />
            }
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
                  the invite link to be placed in your friend’s lobby
                  automatically. Both options ensure you get into the game. Make
                  sure the code is entered correctly and that your internet
                  connection is stable.
                </p>

                <h4>Objective</h4>
                <p>
                  Connect with your friends easily so you can jump straight into
                  the game together.
                </p>
              </>
            }
            icon={
              <Icon
                className={"game-icon-box"}
                path={
                  "M2.873 11.297V4.142H1.699L0 5.379v1.137l1.64-1.18h.06v5.961zm3.213-5.09v-.063c0-.618.44-1.169 1.196-1.169.676 0 1.174.44 1.174 1.106 0 .624-.42 1.101-.807 1.526L4.99 10.553v.744h4.78v-.99H6.643v-.069L8.41 8.252c.65-.724 1.237-1.332 1.237-2.27C9.646 4.849 8.723 4 7.308 4c-1.573 0-2.36 1.064-2.36 2.15v.057zm6.559 1.883h.786c.823 0 1.374.481 1.379 1.179.01.707-.55 1.216-1.421 1.21-.77-.005-1.326-.419-1.379-.953h-1.095c.042 1.053.938 1.918 2.464 1.918 1.478 0 2.642-.839 2.62-2.144-.02-1.143-.922-1.651-1.551-1.714v-.063c.535-.09 1.347-.66 1.326-1.678-.026-1.053-.933-1.855-2.359-1.845-1.5.005-2.317.88-2.348 1.898h1.116c.032-.498.498-.944 1.206-.944.703 0 1.206.435 1.206 1.07.005.64-.504 1.106-1.2 1.106h-.75z"
                }
              />
            }
          />
        </div>
      </div>
    </div>
  );
}
