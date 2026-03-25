import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../theme/tokens";
import { useTheme } from "../../../theme/ThemeContext";
import { Card, StatRow } from "../../../components";

type WithholdingResultProps = {
  numAmount: number;
  incomeTax: number;
  localTax: number;
  netAmount: number;
};

export default function WithholdingResult({ numAmount, incomeTax, localTax, netAmount }: WithholdingResultProps) {
  const { t } = useTheme();

  return (
    <Card className="mx-5 mt-5 p-5">
      <View className="flex-row items-center gap-2 mb-4">
        <View className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: t.primaryLight }}>
          <Ionicons name="receipt-outline" size={16} color={t.primary} />
        </View>
        <Text style={{ color: t.text }} className="text-lg font-bold">원천징수 결과</Text>
      </View>
      <StatRow label="수입 금액" value={`${numAmount.toLocaleString()}원`} />
      <StatRow label="소득세 (3%)" value={`-${incomeTax.toLocaleString()}원`} valueColor={colors.danger[500]} />
      <StatRow label="지방소득세 (0.3%)" value={`-${localTax.toLocaleString()}원`} valueColor={colors.danger[500]} showBorder={false} />
      <View className="flex-row justify-between items-center mt-4 rounded-2xl p-4" style={{ backgroundColor: t.primaryLight }}>
        <Text style={{ color: t.primaryText }} className="text-sm font-semibold">실수령액</Text>
        <Text style={{ color: t.primaryText }} className="text-2xl font-bold">{netAmount.toLocaleString()}원</Text>
      </View>
    </Card>
  );
}
