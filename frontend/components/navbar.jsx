import { Link } from "react-router-dom";
import { use, useState } from "react";
import { Icon } from "./icons.jsx";
import Button from "./button.jsx";
import Image from "./images.jsx";

import "../styles/variable.css";
import "../styles/navbar.css";

export default function Navbar() {
  const [user, setUser] = useState({
    name: "John Doe",
    picture: <Image name="placeholder" />
  });
  
  return (
    <nav>
      <div className="navbar-inner">
        
        <div className="navbar-start">
          <Image name="logo" />
          <Button link="/home" text="Home" />
        </div>

        <div className="navbar-end">
          {user ? (
            <>
              <p className="navbar-username">{user.name}</p>
              <Link to="/profile">
                {user.picture ? user.picture : <Icon name="anonymous" />}
              </Link>
            </>
          ) : (
            <>
              <Button link="/signin" text="Sign In" />
              <Button link="/signup" text="Sign Up" />
            </>
          )}
        </div>

      </div>
    </nav>
  );
}