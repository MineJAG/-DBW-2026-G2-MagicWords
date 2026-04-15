// need the import from backend here
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    //function from backend is called here
    setUser({
      name: "John Doe",
      picture: null,
      stats: {
        gamesPlayed: 100,
        highestScore: 5000,
        gamesWon: 175,
        gamesLost: 50,
        winRate: 50,
        totalWordsFound: 1200,
        longestWordFound: "Chipingongo",
        averageWordLength: 6.5,
        mostWordsInOneMatch: 15,
        longestStreak: 10,
      },
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
