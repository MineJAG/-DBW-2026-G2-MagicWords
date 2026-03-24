import logo from "../assets/images/logo.png";
import placeholder from "../assets/images/placeholder.png";
import signBackground from "../assets/images/sign-background.png";
 
export function Image({ className, name }) {
  return (
    <img src={name} className={className} />
  );
}

 