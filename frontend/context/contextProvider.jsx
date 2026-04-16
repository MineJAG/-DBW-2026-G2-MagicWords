import { UserProvider } from "./userContext.jsx";
import { ThemeProvider } from "./themeContext.jsx";
import { GameProvider } from "./gameContext.jsx";
import { RoomProvider } from "./roomContext.jsx";

export default function ContextProvider({ children }) {
  return (
    <RoomProvider>
    <GameProvider>
      <ThemeProvider>
        <UserProvider>{children}</UserProvider>
      </ThemeProvider>
    </GameProvider>
    </RoomProvider>
  );
}