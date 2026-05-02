import Navbar from "../components/navbar.jsx";
import { SignupForm } from "../components/form.jsx";

import "../styles/variable.css";
import "../styles/sign.css";

export default function Signup() {
  return (
    <>
      <div className="sign-page">
        <Navbar />
        <div className="container-fluid sign-container">
          <div className="sign-row">
            <div className="col-12 col-lg-6 sign-content-col">
              <SignupForm />
            </div>
            <div className="col-6 sign-image-col"></div>
          </div>
        </div>
      </div>
    </>
  );
}
