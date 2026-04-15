import { Link } from "react-router-dom";

import { useUser } from "../context/userContext.jsx";
import { useTheme } from "../context/themeContext.jsx";

import { Icon } from "./icons.jsx";
import Button from "./button.jsx";
import Image from "./images.jsx";

import "../styles/variable.css";
import "../styles/main.css";

export default function Navbar() {
  const { user } = useUser();
  const { theme, setTheme } = useTheme();
  return (
    <nav>
      <div className="navbar-inner">
        <div className="navbar-start">
          <Image className="logo-dark" name="logoDark" />
          <Image className="logo-light" name="logoLight" />
          <Button link="/home" text="Home" />
        </div>

        <div className="navbar-end">
          {/* Theme Toggle Switch */}
          <div
            className={`theme-toggle ${theme === "dark" ? "toggle-dark" : "toggle-light"}`}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <div className="toggle-track">
              <div className="toggle-thumb" />
            </div>
          </div>
          {user ? (
            <>
              <p className="navbar-username">{user?.name}</p>
              <Link to="/profile">
                {user?.picture ? user?.picture : <Icon name="anonymous" />}
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
