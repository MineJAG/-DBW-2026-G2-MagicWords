"use strict";

import { useCallback } from "react";
import { useUser } from "../context/userContext.jsx";
import { useTheme } from "../context/themeContext.jsx";
import { useRoom } from "../context/roomContext.jsx";
import { useRoomActions } from "./useRoomActions.js";

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
