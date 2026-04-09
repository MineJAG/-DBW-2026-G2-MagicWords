import logo from "../assets/images/logo.png";
import placeholder from "../assets/images/placeholder.png";
import purpleLeafsBackground from "../assets/images/purpleLeafsBackground.png";

const images = {
  logo,
  placeholder,
  purpleLeafsBackground,
};

export function Image({ className, name, alt = "" }) {
  const src = images[name];

  // Optional safety check (helps debugging instead of silent failure)
  if (!src) {
    console.error(`Image "${name}" not found in images map`);
    return null;
  }

  return <img src={src} className={className} alt={alt} />;
}