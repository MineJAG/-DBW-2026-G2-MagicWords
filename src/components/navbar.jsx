import { useState } from "react";
import "../styles/variable.css";
import "../styles/navbar.css";
import Button from "./button.jsx";
import { Logo } from "./images.jsx";

export default function Navbar() {
  var [user, setUser] = useState(null); //TODO substituir
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
                <Button link="/" text={user.name} />
              </div>
            {user.picture ? ( <> <div className="col-1 text-start">
                <Button link="/" text="Sign Out" />
              </div></>
              
            ): (<><div className="col-1 text-start">
                <Button link="/" text="Sign Up" />
              </div></>)}
            </>
          ) : (
            <>
              <div className="col-1 text-end">
                <Button link="/" text="Sign In" />
              </div>
              <div className="col-1 text-start">
                <Button link="/" text="Sign Up" />
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
