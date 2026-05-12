import { Link } from "react-router-dom";

import { useNavbar } from "../hooks/useNavbar.js";

import { Icon } from "./icons.jsx";
import Button from "./button.jsx";
import Image from "./images.jsx";

import "../styles/variable.css";
import "../styles/main.css";

export default function Navbar() {
  const { user, theme, handleToggleTheme, handleLeaveOnNav } = useNavbar();

  return (
    <nav>
      <div className="navbar-inner">
        <div className="navbar-start">
          <Image className="logo-dark" name="logoDark" />
          <Image className="logo-light" name="logoLight" />
          <Button link="/home" text="Home" onClick={handleLeaveOnNav} />
        </div>

        <div className="navbar-end">
          {/* Theme Toggle Switch */}
          <div
            className={`theme-toggle ${theme === "dark" ? "toggle-dark" : "toggle-light"}`}
            onClick={handleToggleTheme}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <div className="toggle-track">
              <div className="toggle-thumb" />
            </div>
          </div>
          {user ? (
            <>
              <p className="navbar-username">{user?.name}</p>
              <Link to="/profile" onClick={handleLeaveOnNav}>
                {user?.picture ? <img src={user?.picture} alt="Profile picture" /> : <Icon name="anonymous" />}
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
