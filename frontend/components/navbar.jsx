import { Link } from "react-router-dom";
import { useState } from "react";
import { Icon } from "./icons.jsx";
import Button from "./button.jsx";
import { Image } from "./images.jsx";

import "../styles/variable.css";
import "../styles/navbar.css";

export default function Navbar() {
  const [user, setUser] = useState(null);

  return (
    <nav>
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-2 col-sm-2 col-md-2 col-lg-2">
            <Image name="logo" />
          </div>

          <div
            className={
              user
                ? "col-6 col-sm-6 col-md-6 col-lg-7 text-start"
                : "col-4 col-sm-4 col-md-4 col-lg-6 text-start"
            }
          >
            <Button link="/home" text="Home" />
          </div>

          {user ? (
            <>
              <div className="col-3 col-sm-3 col-md-3 col-lg-2 text-end">
                <p className="m-0">{user.name}</p>
              </div>

              <div className="col-1 col-sm-1 col-md-1 col-lg-1 text-start">
                {user.picture ? (
                  <Link to="/profile">{user.picture}</Link>
                ) : (
                  <Link to="/profile">
                    <Icon name="anonymous" />
                  </Link>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="col-3 col-sm-3 col-md-3 col-lg-2 text-end">
                <Button link="/signin" text="Sign In" />
              </div>

              <div className="col-3 col-sm-3 col-md-3 col-lg-2 text-start">
                <Button link="/signup" text="Sign Up" />
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}