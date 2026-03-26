import { Pressable, Text, ActivityIndicator } from "react-native";
import { useTheme } from "../theme/ThemeContext";

type ButtonProps = {
  title: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "sm";
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export default function Button({ title, variant = "primary", size = "md", onPress, disabled, loading }: ButtonProps) {
  const { t, isDark } = useTheme();
  const py = size === "md" ? 16 : 10;

  const styles = {
    primary: { bg: t.primary, text: "#FFFFFF" },
    secondary: { bg: t.card, text: t.text, border: t.border },
    ghost: { bg: "transparent", text: t.textMuted },
  }[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className="rounded-2xl px-2 items-center active:opacity-80"
      style={[
        { backgroundColor: styles.bg, paddingVertical: py },
        styles.border ? { borderWidth: 1, borderColor: styles.border } : {},
        disabled ? { opacity: 0.5 } : {},
      ]}
    >
      {loading ? (
        <ActivityIndicator color={styles.text} size="small" />
      ) : (
        <Text
          className={`${size === "md" ? "text-base" : "text-sm"} font-bold`}
          style={{ color: styles.text }}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}
