import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, tintBg } from "../theme/tokens";
import { useTheme } from "../theme/ThemeContext";

type TransactionItemProps = {
  title: string;
  subtitle: string;
  amount: number;
  type: "income" | "expense";
  showBorder?: boolean;
  onPress?: () => void;
};

export default function TransactionItem({ title, subtitle, amount, type, showBorder = true, onPress }: TransactionItemProps) {
  const { t, isDark } = useTheme();
  const isIncome = type === "income";
  const accent = isIncome ? t.primaryText : colors.danger[500];

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-5 py-4 active:opacity-80"
      style={showBorder ? { borderBottomWidth: 1, borderBottomColor: t.border } : {}}
    >
      <View
        className="w-10 h-10 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: isIncome ? t.primaryLight : tintBg(colors.danger[500], isDark ? 0.15 : 0.08) }}
      >
        <Ionicons name={isIncome ? "arrow-down" : "arrow-up"} size={18} color={accent} />
      </View>
      <View className="flex-1">
        <Text style={{ color: t.text }} className="text-sm font-semibold">{title}</Text>
        <Text style={{ color: t.textMuted }} className="text-xs mt-0.5">{subtitle}</Text>
      </View>
      <Text className="text-base font-bold" style={{ color: accent }}>
        {isIncome ? "+" : "-"}{Math.abs(amount).toLocaleString()}원
      </Text>
    </Pressable>
  );
}
