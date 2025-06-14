"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  mode: ThemeMode;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: "light",
  resolvedTheme: "light",
  setTheme: () => {},
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
  const [mode, setMode] = useState<ThemeMode>("light");
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");

  // Listen to system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemTheme(mediaQuery.matches ? "dark" : "light");

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as ThemeMode;
    if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
      setMode(savedTheme);
    } else {
      // Default to light theme if no saved theme
      setMode("light");
    }
  }, []);

  const setTheme = (theme: ThemeMode) => {
    setMode(theme);
    localStorage.setItem("theme", theme);
  };

  const resolvedTheme = mode === "system" ? systemTheme : mode;

  return (
    <ThemeContext.Provider value={{ mode, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
