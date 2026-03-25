import Navbar from "../components/navbar.jsx";
import { Image } from "../components/images.jsx";

import "../styles/variable.css";
import "../styles/signin.css";

export default function Signup() {
  return (
    <div className="signin-page">
      <Navbar />
      <div className="container-fluid signin-container">
        <div className="row signin-row">
          <div className="col-6">
            
          </div>
          <div className="col-6 signin-image-col">
            <Image name="signBackground" className={"signin-background-wrapper"} />
          </div>
        </div>
      </div>
    </div>
  );
}