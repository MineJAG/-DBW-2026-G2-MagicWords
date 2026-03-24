import Navbar from "../components/navbar.jsx";
import { SignBackground } from "../components/images.jsx";

import "../styles/variable.css";
import "../styles/signin.css";

export default function Signup() {
  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          <div className="col-6">
            <SignBackground />
          </div>
          <div className="col-6"></div>
        </div>
      </div>
    </>
  );
}
