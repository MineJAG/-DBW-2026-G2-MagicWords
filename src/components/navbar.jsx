import "../styles/index.css";
import "../styles/navbar.css";
import Button from "./button.jsx";
import {Logo} from "./images.jsx";

export default function Navbar() {
  return (
    <nav>
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-1">
            <Logo />
          </div>
          <div className="col-9 text-start"><Button link="/" text = "Home" /></div>
          <div className="col-1 text-end"><Button link="/" text = "Sign In" /></div>
          <div className="col-1 text-start"><Button link="/" text = "Sign Up" /></div>
        </div>
      </div>
    </nav>
  );
}
