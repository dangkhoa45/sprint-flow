"use client";

import {
  createContext,
  ReactNode,
  useContext,
} from "react";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: "light",
  toggleTheme: () => {},
});

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeModeProvider({ children }: ThemeProviderProps) {
  // Always use light mode - no state management needed
  const mode: ThemeMode = "light";

  const toggleTheme = () => {
    // Theme switching is disabled - always use light mode
    console.log("Theme switching is disabled. Always using light mode.");
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
