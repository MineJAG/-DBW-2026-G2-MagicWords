import { useState, useEffect } from "react";
import { Icon } from "./icons.jsx";
import Button from "./button.jsx";
import { Logo } from "./images.jsx";
import { Placeholder } from "./images.jsx";

import "../styles/variable.css";
import "../styles/navbar.css";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser({
      name: "Bibby",
      picture: null,
    });
  }, []);

  return (
    <nav>
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-1">
            <Logo />
          </div>

          <div className="col-9 text-start">
            <Button link="/" text="Home" />
          </div>

          {user ? (
            <>
              <div className="col-1 text-end">
                <p className="m-0">{user.name}</p>
              </div>

              <div className="col-1 text-start">
                {user.picture ? (
                  <a href="/profile" type="button" >{user.picture}</a>
                ) : (
                  <a href="/profile" type="button"><Icon name="anonymous" /></a>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="col-1 text-end">
                <Button link="/signin" text="Sign In" />
              </div>

              <div className="col-1 text-start">
                <Button link="/signup" text="Sign Up" />
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
