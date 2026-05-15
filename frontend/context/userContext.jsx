import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../lib/api.js";

const UserContext = createContext(null);

/**
 * Stores the logged-in user. When the app starts, it asks the server "who am
 * I?" using `api.me()` to fill this in. `loading` is `true` until that
 * answer comes back.
 *
 * @param {{ children: import("react").ReactNode }}
 * @returns {JSX.Element}
 */
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

/**
 * Hook to read the logged-in user.
 *
 * @returns {{
 *   user: object | null,   // the user, or null if logged out
 *   setUser: (user: object | null) => void,    // change the user
 *   loading: boolean,    // true while checking the session
 * }}
 */
export function useUser() {
  return useContext(UserContext);
}