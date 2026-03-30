import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Icon } from "./icons.jsx";
import Button from "./button.jsx";
import { Image } from "./images.jsx";

import "../styles/variable.css";
import "../styles/navbar.css";

/*  useEffect(() => {
    setUser({
      name: null,
      picture: null,
    });
  }, []);
  */
export default function Navbar() {
  const [user, setUser] = useState(null);

  return (
    <nav>
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-lg-1 col-sm-2">
            <Image name="logo" />
          </div>

          <div className="col-lg-9 col-sm-4 text-start">
            <Button link="/home" text="Home" />
          </div>

          {user ? (
            <>
              <div className="col-lg-1 text-end">
                <p className="m-0">{user.name}</p>
              </div>

              <div className="col-lg-1 text-start">
                {user.picture ? (
                  <Link to="/profile">{user.picture}</Link>
                ) : (
                  <Link to="/profile"><Icon name="anonymous" /></Link>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="col-lg-1 col-sm-3 text-end">
                <Button link="/signin" text="Sign In" />
              </div>

              <div className="col-lg-1 col-sm-3 text-start">
                <Button link="/signup" text="Sign Up" />
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
