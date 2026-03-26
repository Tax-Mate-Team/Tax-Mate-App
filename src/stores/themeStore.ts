import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../theme/tokens";

export type ThemeColors = {
  bg: string;
  card: string;
  surface: string;
  border: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  inputBg: string;
  tabBg: string;
  primary: string;
  primaryLight: string;
  primaryText: string;
};

const lightTheme: ThemeColors = {
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
};

const darkTheme: ThemeColors = {
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
};

type ThemeStore = {
  isDark: boolean;
  t: ThemeColors;
  toggle: () => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      isDark: false,
      t: lightTheme,
      toggle: () => {
        const next = !get().isDark;
        set({ isDark: next, t: next ? darkTheme : lightTheme });
      },
    }),
    {
      name: "taxmate_theme",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ isDark: state.isDark }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.t = state.isDark ? darkTheme : lightTheme;
        }
      },
    },
  ),
);
