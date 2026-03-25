import { Pressable, Text } from "react-native";
import { shadows } from "../theme/tokens";
import { useTheme } from "../theme/ThemeContext";

type BadgeProps = {
  label: string;
  active: boolean;
  onPress: () => void;
  variant?: "pill" | "tab";
};

export default function Badge({ label, active, onPress, variant = "pill" }: BadgeProps) {
  const { t, isDark } = useTheme();

  if (variant === "tab") {
    return (
      <Pressable
        onPress={onPress}
        className="flex-1 py-3 rounded-xl items-center"
        style={active ? [{ backgroundColor: t.card }, shadows.sm] : undefined}
      >
        <Text className="text-sm font-semibold" style={{ color: active ? t.text : t.textMuted }}>
          {label}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      className="px-4 py-2 rounded-full"
      style={
        active
          ? { backgroundColor: isDark ? "#E2E8F0" : "#111827" }
          : { backgroundColor: t.card, borderWidth: 1, borderColor: t.border }
      }
    >
      <Text className="text-sm font-semibold" style={{ color: active ? (isDark ? "#111827" : "#FFFFFF") : t.textMuted }}>
        {label}
      </Text>
    </Pressable>
  );
}
