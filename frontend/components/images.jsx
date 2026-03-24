import logo from "../assets/images/logo.png";
import placeholder from "../assets/images/placeholder.png";
import signBackground from "../assets/images/sign-background.png";

export const Logo = () => {
  return <img src={logo} alt="logo" className="text-center" />;
};

export const Placeholder = () => {
  return <img src={placeholder} alt="profile picture" />;
};

export const SignBackground = () => {
  return <img src={signBackground} alt="sign background" />;
};