"use strict";

import { useCallback } from "react";
import { useUser } from "../context/userContext.jsx";
import { useTheme } from "../context/themeContext.jsx";
import { useRoom } from "../context/roomContext.jsx";
import { useRoomActions } from "./useRoomActions.js";

/**
 * Bundles the data and callbacks the navbar needs: the current user and
 * theme for display, a toggler that flips light/dark, and a "leave on
 * navigate" handler that pulls the user out of any active room before
 * routing away (a no-op when not in a room).
 *
 * @returns {{
 *   user: object | null,
 *   theme: "light" | "dark",
 *   handleToggleTheme: () => void,
 *   handleLeaveOnNav: () => void,
 * }}
 */
export function useNavbar() {
  const { user } = useUser();
  const { theme, setTheme } = useTheme();
  const { room } = useRoom();
  const { leaveRoom } = useRoomActions();

  const handleToggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const handleLeaveOnNav = useCallback(() => {
    if (room) leaveRoom();
  }, [room, leaveRoom]);

  return {
    user,
    theme,
    handleToggleTheme,
    handleLeaveOnNav,
  };
}
