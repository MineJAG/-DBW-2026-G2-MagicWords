"use strict";

import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext.jsx";
import { api } from "../lib/api.js";

/**
 * Log the current user out. Calls the API to clear the server-side cookie,
 * but always clears the client-side user and redirects to `/home` even if
 * the request fails (so a stale session can never lock the user in).
 *
 * @returns {{ handleLogout: () => Promise<void> }}
 */
export function useLogout() {
  const { setUser } = useUser();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await api.logout();
    } finally {
      setUser(null);
      navigate("/home", { replace: true });
    }
  }

  return { handleLogout };
}
