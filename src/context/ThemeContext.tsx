
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>("light");
  const { user } = useAuth();
  
  // Load saved theme preference on mount and when user changes
  useEffect(() => {
    const loadThemePreference = () => {
      if (!user) {
        // If no user is logged in, use system preference or default to light
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setThemeState(systemPrefersDark ? "dark" : "light");
        return;
      }
      
      // Get user-specific theme preference
      const savedTheme = localStorage.getItem(`theme-preference-${user.username}`);
      if (savedTheme === "dark" || savedTheme === "light") {
        setThemeState(savedTheme);
      } else {
        // If no saved preference, use system preference
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setThemeState(systemPrefersDark ? "dark" : "light");
      }
    };
    
    loadThemePreference();
  }, [user]);
  
  // Apply theme class to document whenever theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    
    // Save preference if user is logged in
    if (user) {
      localStorage.setItem(`theme-preference-${user.username}`, theme);
    }
  }, [theme, user]);
  
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
