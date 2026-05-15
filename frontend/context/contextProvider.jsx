import { UserProvider } from "./userContext.jsx";
import { ThemeProvider } from "./themeContext.jsx";
import { GameProvider } from "./gameContext.jsx";
import { RoomProvider } from "./roomContext.jsx";

/**
 * Wraps the whole app in every provider at once. The order matters:
 * Room is the outermost, then Game, Theme, User. Inner ones can use what's
 * in the outer ones (for example, a hook inside `UserProvider` can call
 * `useRoom()`).
 *
 * @param {{ children: import("react").ReactNode }}
 * @returns {JSX.Element}
 */
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