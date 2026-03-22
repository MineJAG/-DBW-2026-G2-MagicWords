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
              </ul>{" "}
            </>
          }
          content2={<Placeholder />}
        />
      </div>

      <div className="row align-content-center p-2 m-4">
        <div className="col-6 d-flex justify-content-center">
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
        <div className="col-6 d-flex justify-content-center">
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
    </div>
  );
}
