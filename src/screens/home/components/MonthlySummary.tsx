import { View, Text, Pressable } from "react-native";
import { colors } from "../../../theme/tokens";
import { useTheme } from "../../../theme/ThemeContext";
import { Card, StatRow } from "../../../components";

const MONTH = new Date().getMonth() + 1;

export default function MonthlySummary() {
  const { t } = useTheme();

  return (
    <Card className="mx-5 mt-4 p-5">
      <View className="flex-row justify-between items-center mb-4">
        <Text style={{ color: t.text }} className="text-lg font-bold">{MONTH}월 요약</Text>
        <Pressable className="active:opacity-60">
          <Text style={{ color: t.primaryText }} className="text-sm font-semibold">자세히 보기</Text>
        </Pressable>
      </View>
      <StatRow label="총 수입" value="4,500만원" dotColor={colors.primary[600]} />
      <StatRow label="총 지출" value="124만 5천원" dotColor={colors.danger[500]} />
      <StatRow label="순수익" value="4,375만 5천원" dotColor={colors.success[500]} showBorder={false} />
    </Card>
  );
}
