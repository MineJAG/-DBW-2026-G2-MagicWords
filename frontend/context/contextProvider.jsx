import { UserProvider } from "./userContext.jsx";
import { ThemeProvider } from "./themeContext.jsx";

export default function ContextProvider({ children }) {
  return (
    <ThemeProvider>
      <UserProvider>{children}</UserProvider>
    </ThemeProvider>
  );
}
