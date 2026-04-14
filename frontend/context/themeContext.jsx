import { createContext, useContext, useState, useEffect } from "react";

const themeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        document.documentElement.className = theme;
    }, [theme]);

    return (
        <themeContext.Provider value={{ theme, setTheme }}>
            {children}
        </themeContext.Provider>
    );
}
export function useTheme() {
    return useContext(themeContext);
}
