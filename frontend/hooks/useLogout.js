"use strict";

import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext.jsx";
import { api } from "../lib/api.js";

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
