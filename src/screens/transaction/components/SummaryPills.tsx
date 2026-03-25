import { View, Text } from "react-native";
import { useTheme } from "../../../theme/ThemeContext";
import { colors, tintBg } from "../../../theme/tokens";

type SummaryPillsProps = {
  totalIncome: number;
  totalExpense: number;
};

export default function SummaryPills({ totalIncome, totalExpense }: SummaryPillsProps) {
  const { t, isDark } = useTheme();

  return (
    <View className="flex-row mx-5 mt-3 gap-3">
      <View className="flex-1 rounded-2xl p-4" style={{ backgroundColor: isDark ? tintBg(colors.primary[500], 0.12) : colors.primary[50] }}>
        <Text style={{ color: colors.primary[400] }} className="text-xs font-medium">수입</Text>
        <Text style={{ color: t.primaryText }} className="text-lg font-bold mt-1">
          +{(totalIncome / 10000).toFixed(0)}만원
        </Text>
      </View>
      <View className="flex-1 rounded-2xl p-4" style={{ backgroundColor: isDark ? tintBg(colors.danger[500], 0.12) : colors.danger[50] }}>
        <Text style={{ color: colors.danger[400] }} className="text-xs font-medium">지출</Text>
        <Text style={{ color: colors.danger[500] }} className="text-lg font-bold mt-1">
          -{(totalExpense / 10000).toFixed(0)}만원
        </Text>
      </View>
    </View>
  );
}
