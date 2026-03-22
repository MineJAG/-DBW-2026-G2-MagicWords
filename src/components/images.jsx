import logo from "../assets/images/logo.png";
import placeholder from "../assets/images/placeholder.png";

export const Logo = () => {
  return <img src={logo} alt="logo" className="text-center" />;
};

export const Placeholder = () => {
  return <img src={placeholder} alt="profile picture" />;
};

export function Icon({className, path}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={className}
      viewBox="0 0 16 16"
    >
      <path d={path} />
    </svg>
  );
}
