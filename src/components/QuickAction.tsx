import { Pressable, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { shadows, tintBg } from "../theme/tokens";
import { useTheme } from "../theme/ThemeContext";

type QuickActionProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  onPress?: () => void;
};

export default function QuickAction({ icon, label, color, onPress }: QuickActionProps) {
  const { t } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      className="flex-1 rounded-2xl py-4 items-center active:scale-95"
      style={[{ backgroundColor: t.card }, shadows.md]}
    >
      <View
        className="w-11 h-11 rounded-full items-center justify-center mb-2"
        style={{ backgroundColor: tintBg(color) }}
      >
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={{ color: t.textSecondary }} className="text-xs font-semibold">{label}</Text>
    </Pressable>
  );
}
