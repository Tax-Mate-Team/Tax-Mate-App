import { View } from "react-native";
import { useTheme } from "../../../theme/ThemeContext";
import { Badge } from "../../../components";

type CalcMode = "withholding" | "income_tax";

type ModeSelectorProps = {
  mode: CalcMode;
  onModeChange: (mode: CalcMode) => void;
};

export default function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  const { t } = useTheme();

  return (
    <View style={{ backgroundColor: t.tabBg }} className="mx-5 mt-4 flex-row rounded-2xl p-1">
      <Badge variant="tab" label="원천징수 계산" active={mode === "withholding"} onPress={() => onModeChange("withholding")} />
      <Badge variant="tab" label="종소세 계산" active={mode === "income_tax"} onPress={() => onModeChange("income_tax")} />
    </View>
  );
}
