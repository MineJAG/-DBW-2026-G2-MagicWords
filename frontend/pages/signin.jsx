import Navbar from "../components/navbar.jsx";
import { Image } from "../components/images.jsx";

import "../styles/variable.css";
import "../styles/signin.css";

export default function Signup() {
  return (
    <div className="signin-page d-flex flex-column">
      <Navbar />

      <div className="container-fluid flex-grow-1">
        <div className="row h-100">
          
          {/* LEFT SIDE (form area) */}
          <div className="col-6 d-flex align-items-center justify-content-center">
            {/* your signup form goes here */}
          </div>

          {/* RIGHT SIDE (image) */}
          <div className="col-6 p-0 h-100">
            <Image name={signBackground} className="signin-background-wrapper"/>
          </div>

        </div>
      </div>
    </div>
  );
}