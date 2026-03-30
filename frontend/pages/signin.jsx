import { useEffect } from "react";
import Navbar from "../components/navbar.jsx";
import { Image } from "../components/images.jsx";
import { SigninForm } from "../components/form.jsx";
import { initializeFormValidation } from "../hooks/formValidation.js";

import "../styles/variable.css";
import "../styles/signin.css";

export default function Signin() {
  useEffect(() => initializeFormValidation(), []);

  return (
    <div className="signin-page">
      <Navbar />
      <div className="container-fluid signin-container">
        <div className="signin-row">
          <div className="col-12 col-lg-6 signin-content-col">
            <SigninForm />
          </div>
          <div className="col-6 signin-image-col"></div>
        </div>
      </div>
    </div>
  );
}
