export const colors = {
  primary: {
    50: "#EEF2FF",
    100: "#E0E7FF",
    200: "#C7D2FE",
    400: "#818CF8",
    500: "#6366F1",
    600: "#4F46E5",
    700: "#4338CA",
  },
  danger: {
    50: "#FEF2F2",
    100: "#FEE2E2",
    400: "#F87171",
    500: "#EF4444",
  },
  success: {
    50: "#ECFDF5",
    100: "#D1FAE5",
    400: "#34D399",
    500: "#10B981",
  },
  warning: {
    50: "#FFFBEB",
    500: "#F59E0B",
  },
  purple: {
    500: "#8B5CF6",
  },
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    700: "#374151",
    900: "#111827",
  },
  white: "#FFFFFF",
  black: "#000000",
  // Dark mode surfaces
  dark: {
    bg: "#0F0F1E",
    card: "#1E1E36",
    surface: "#1A1A2E",
    border: "#2D2D4A",
    text: "#E2E8F0",
    textSecondary: "#94A3B8",
    textMuted: "#64748B",
  },
} as const;

export const shadows = {
  sm: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  lg: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  colored: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  }),
} as const;

export function tintBg(hex: string, alpha = 0.08) {
  const alphaHex = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0");
  return hex + alphaHex;
}
