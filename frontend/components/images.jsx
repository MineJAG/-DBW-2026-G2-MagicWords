import logo from "../assets/images/logo.png";
import placeholder from "../assets/images/placeholder.png";
import purpleLeafsBackground from "../assets/images/purpleLeafsBackground.png";

const images = {
  logo,
  placeholder,
  purpleLeafsBackground,
};

export default function Image({ className, name, alt = "" }) {
  const src = images[name];
  return <img src={src} className={className} alt={alt} />;
}
