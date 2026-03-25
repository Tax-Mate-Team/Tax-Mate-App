import { View, Text } from "react-native";
import { useTheme } from "../theme/ThemeContext";

type StatRowProps = {
  label: string;
  value: string;
  dotColor?: string;
  valueColor?: string;
  showBorder?: boolean;
};

export default function StatRow({ label, value, dotColor, valueColor, showBorder = true }: StatRowProps) {
  const { t } = useTheme();

  return (
    <View
      className="flex-row justify-between items-center py-3"
      style={showBorder ? { borderBottomWidth: 1, borderBottomColor: t.border } : {}}
    >
      <View className="flex-row items-center gap-2">
        {dotColor && <View className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }} />}
        <Text style={{ color: t.textSecondary }} className="text-sm">{label}</Text>
      </View>
      <Text className="text-base font-bold" style={{ color: valueColor || t.text }}>{value}</Text>
    </View>
  );
}
