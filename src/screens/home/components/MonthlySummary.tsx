import { View, Text, Pressable } from "react-native";
import { colors } from "../../../theme/tokens";
import { useTheme } from "../../../theme/ThemeContext";
import { Card, StatRow } from "../../../components";

const MONTH = new Date().getMonth() + 1;

function fmt(n?: number) {
  if (n == null) return "-";
  if (Math.abs(n) >= 10000) return `${(n / 10000).toFixed(0)}만원`;
  return `${n.toLocaleString()}원`;
}

type MonthlySummaryProps = {
  totalIncome?: number;
  totalExpense?: number;
  netProfit?: number;
  isLoggedIn: boolean;
};

export default function MonthlySummary({ totalIncome, totalExpense, netProfit, isLoggedIn }: MonthlySummaryProps) {
  const { t } = useTheme();

  return (
    <Card className="mx-5 mt-4 p-5">
      <View className="flex-row justify-between items-center mb-4">
        <Text style={{ color: t.text }} className="text-lg font-bold">{MONTH}월 요약</Text>
      </View>
      <StatRow label="총 수입" value={isLoggedIn ? fmt(totalIncome) : "-"} dotColor={colors.primary[600]} />
      <StatRow label="총 지출" value={isLoggedIn ? fmt(totalExpense) : "-"} dotColor={colors.danger[500]} />
      <StatRow label="순수익" value={isLoggedIn ? fmt(netProfit) : "-"} dotColor={colors.success[500]} showBorder={false} />
    </Card>
  );
}
