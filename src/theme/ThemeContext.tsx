import { createContext, useContext, useState, useCallback } from "react";
import { colors } from "./tokens";

const lightTheme = {
  bg: colors.gray[50],
  card: colors.white,
  surface: colors.white,
  border: colors.gray[100],
  text: colors.gray[900],
  textSecondary: colors.gray[500],
  textMuted: colors.gray[400],
  inputBg: colors.gray[50],
  tabBg: colors.gray[200],
  primary: colors.primary[600],
  primaryLight: colors.primary[50],
  primaryText: colors.primary[600],
} as const;

const darkTheme = {
  bg: "#0F0F1E",
  card: "#1E1E36",
  surface: "#1A1A2E",
  border: "#2D2D4A",
  text: "#E2E8F0",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",
  inputBg: "rgba(255,255,255,0.05)",
  tabBg: "#1A1A2E",
  primary: colors.primary[400],
  primaryLight: "rgba(99,102,241,0.15)",
  primaryText: colors.primary[400],
} as const;

export type ThemeColors = typeof lightTheme;

type ThemeContextType = {
  isDark: boolean;
  toggle: () => void;
  t: ThemeColors;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggle: () => {},
  t: lightTheme,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  const toggle = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const t = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, toggle, t }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
