import { View } from "react-native";
import { colors } from "../../../theme/tokens";
import { QuickAction } from "../../../components";

export default function QuickActions() {
  return (
    <View className="flex-row mx-5 mt-5 gap-3">
      <QuickAction icon="add-circle" label="수입 등록" color={colors.primary[600]} />
      <QuickAction icon="remove-circle" label="지출 등록" color={colors.danger[500]} />
      <QuickAction icon="calculator" label="세금 계산" color={colors.success[500]} />
    </View>
  );
}
