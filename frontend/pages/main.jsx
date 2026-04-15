import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app.jsx";

import initializeTheme from "../hooks/themeInit.js";

initializeTheme(); //initialize theme so it doesnt flash

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);