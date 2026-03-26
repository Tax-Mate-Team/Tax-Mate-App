import { View, Text, TextInput } from "react-native";
import { useTheme } from "../../../theme/ThemeContext";
import { Card, Button } from "../../../components";

type CalcMode = "withholding" | "income_tax";

type InputSectionProps = {
  mode: CalcMode;
  amount: string;
  expense: string;
  onAmountChange: (text: string) => void;
  onExpenseChange: (text: string) => void;
  onCalculate: () => void;
  loading?: boolean;
};

export default function InputSection({ mode, amount, expense, onAmountChange, onExpenseChange, onCalculate, loading }: InputSectionProps) {
  const { t } = useTheme();

  return (
    <Card className="mx-5 mt-5 p-5">
      <Text style={{ color: t.textSecondary }} className="text-sm font-medium mb-2">
        {mode === "withholding" ? "수입 금액" : "연간 총 수입"}
      </Text>
      <View className="flex-row items-center rounded-2xl px-4 py-3 mb-1" style={{ backgroundColor: t.inputBg }}>
        <TextInput
          className="flex-1 text-2xl font-bold"
          style={{ color: t.text }}
          placeholder="0"
          placeholderTextColor={t.textMuted}
          keyboardType="numeric"
          value={amount}
          onChangeText={onAmountChange}
        />
        <Text style={{ color: t.textMuted }} className="text-lg font-medium ml-2">원</Text>
      </View>

      {mode === "income_tax" && (
        <View>
          <Text style={{ color: t.textSecondary }} className="text-sm font-medium mt-4 mb-2">연간 경비 (선택)</Text>
          <View className="flex-row items-center rounded-2xl px-4 py-3" style={{ backgroundColor: t.inputBg }}>
            <TextInput
              className="flex-1 text-2xl font-bold"
              style={{ color: t.text }}
              placeholder="0"
              placeholderTextColor={t.textMuted}
              keyboardType="numeric"
              value={expense}
              onChangeText={onExpenseChange}
            />
            <Text style={{ color: t.textMuted }} className="text-lg font-medium ml-2">원</Text>
          </View>
          <Text style={{ color: t.textMuted }} className="text-xs mt-2">* 미입력 시 단순경비율(64.1%)이 적용됩니다</Text>
        </View>
      )}

      <View className="mt-5">
        <Button title="계산하기" onPress={onCalculate} loading={loading} />
      </View>
    </Card>
  );
}
