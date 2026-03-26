import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, tintBg } from "../../../theme/tokens";
import { useTheme } from "../../../theme/ThemeContext";
import { Card, StatRow } from "../../../components";

type IncomeTaxResultProps = {
  numAmount: number;
  appliedExpense: number;
  taxableIncome: number;
  estimatedTax: number;
  alreadyPaid: number;
  additionalTax: number;
  isRefund?: boolean;
};

export default function IncomeTaxResult({ numAmount, appliedExpense, taxableIncome, estimatedTax, alreadyPaid, additionalTax, isRefund: isRefundProp }: IncomeTaxResultProps) {
  const { t, isDark } = useTheme();
  const isRefund = isRefundProp ?? additionalTax <= 0;
  const resultColor = isRefund ? colors.success[500] : colors.danger[500];
  const resultBg = isRefund
    ? (isDark ? tintBg(colors.success[500], 0.12) : colors.success[50])
    : (isDark ? tintBg(colors.danger[500], 0.12) : colors.danger[50]);

  return (
    <Card className="mx-5 mt-5 p-5">
      <View className="flex-row items-center gap-2 mb-4">
        <View className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: isDark ? tintBg(colors.success[500], 0.15) : colors.success[100] }}>
          <Ionicons name="analytics-outline" size={16} color={colors.success[500]} />
        </View>
        <Text style={{ color: t.text }} className="text-lg font-bold">종소세 예상 결과</Text>
      </View>
      <StatRow label="연간 총 수입" value={`${numAmount.toLocaleString()}원`} />
      <StatRow label="적용 경비" value={`${appliedExpense.toLocaleString()}원`} />
      <StatRow label="과세표준" value={`${taxableIncome.toLocaleString()}원`} />
      <StatRow label="산출 세액" value={`${estimatedTax.toLocaleString()}원`} />
      <StatRow label="기납부 원천징수" value={`${alreadyPaid.toLocaleString()}원`} showBorder={false} />
      <View className="flex-row justify-between items-center mt-4 rounded-2xl p-4" style={{ backgroundColor: resultBg }}>
        <Text className="text-sm font-semibold" style={{ color: resultColor }}>
          {isRefund ? "환급 예상" : "추가 납부 예상"}
        </Text>
        <Text className="text-2xl font-bold" style={{ color: resultColor }}>
          {Math.abs(additionalTax).toLocaleString()}원
        </Text>
      </View>
    </Card>
  );
}
