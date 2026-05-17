import logoDark from "../assets/images/logo.png";
import logoLight from "../assets/images/logo-light.png";
import purpleLeafsBackground from "../assets/images/purpleLeafsBackground.png";

const images = {
  logoDark,
  logoLight,
  purpleLeafsBackground,
};

export default function Image({ className, name, alt = "" }) {
  const src = images[name];
  return <img src={src} className={className} alt={alt} />;
}
