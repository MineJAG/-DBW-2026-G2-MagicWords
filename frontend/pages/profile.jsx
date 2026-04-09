import Navbar from "../components/navbar.jsx";
import { SmallDisplay } from "../components/textDisplay.jsx";

import "../styles/variable.css";

export default function Profile() {
  return (
    <>
      <Navbar />
      <SmallDisplay text="Profile" />
    </>
  );
}
