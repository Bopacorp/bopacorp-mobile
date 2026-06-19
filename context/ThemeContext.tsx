import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme as nativeUseColorScheme } from "react-native";
import { getStorageItem, setStorageItem } from "../services/storage";

type ColorScheme = "light" | "dark";

interface ThemeContextType {
  colorScheme: ColorScheme;
  toggleColorScheme: () => void;
  setColorScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  colorScheme: "light",
  toggleColorScheme: () => {},
  setColorScheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>("light");

  useEffect(() => {
    async function loadTheme() {
      try {
        const savedTheme = await getStorageItem("userTheme");
        if (savedTheme === "light" || savedTheme === "dark") {
          setColorSchemeState(savedTheme);
        } else {
          setColorSchemeState("light");
        }
      } catch (e) {
        console.warn("Error loading saved theme, fallback to light:", e);
        setColorSchemeState("light");
      }
    }
    loadTheme();
  }, []);

  const toggleColorScheme = async () => {
    const nextTheme = colorScheme === "light" ? "dark" : "light";
    setColorSchemeState(nextTheme);
    try {
      await setStorageItem("userTheme", nextTheme);
    } catch (e) {
      console.warn("Failed to save user theme preference:", e);
    }
  };

  const setColorScheme = async (scheme: ColorScheme) => {
    setColorSchemeState(scheme);
    try {
      await setStorageItem("userTheme", scheme);
    } catch (e) {
      console.warn("Failed to save user theme preference:", e);
    }
  };

  return (
    <ThemeContext.Provider value={{ colorScheme, toggleColorScheme, setColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
