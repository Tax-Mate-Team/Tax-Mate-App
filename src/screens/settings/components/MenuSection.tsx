import { View, Text, Pressable, Switch, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { tintBg, colors } from "../../../theme/tokens";
import { useTheme } from "../../../theme/ThemeContext";
import { Card } from "../../../components";

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sub?: string;
  color: string;
  onPress?: () => void;
  toggle?: { value: boolean; onValueChange: (v: boolean) => void };
};

type MenuSectionProps = {
  title: string;
  items: MenuItem[];
};

export default function MenuSection({ title, items }: MenuSectionProps) {
  const { t } = useTheme();

  return (
    <View className="mt-6">
      <Text style={{ color: t.textMuted }} className="px-5 text-xs font-semibold uppercase tracking-wider mb-2">
        {title}
      </Text>
      <Card className="mx-5 overflow-hidden">
        {items.map((item, i) => (
          <Pressable
            key={item.label}
            onPress={item.toggle ? undefined : item.onPress}
            className="flex-row items-center px-5 py-4 active:opacity-70"
            style={i < items.length - 1 ? { borderBottomWidth: 1, borderBottomColor: t.border } : {}}
          >
            <View
              className="w-9 h-9 rounded-xl items-center justify-center mr-3"
              style={{ backgroundColor: tintBg(item.color) }}
            >
              <Ionicons name={item.icon} size={20} color={item.color} />
            </View>
            <View className="flex-1">
              <Text style={{ color: t.text }} className="text-sm font-semibold">{item.label}</Text>
              {item.sub && <Text style={{ color: t.textMuted }} className="text-xs mt-0.5">{item.sub}</Text>}
            </View>
            {item.toggle ? (
              <Switch
                value={item.toggle.value}
                onValueChange={item.toggle.onValueChange}
                trackColor={{ false: colors.gray[300], true: colors.primary[400] }}
                thumbColor={colors.white}
                ios_backgroundColor={colors.gray[300]}
                style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
              />
            ) : (
              <Ionicons name="chevron-forward" size={18} color={t.textMuted} />
            )}
          </Pressable>
        ))}
      </Card>
    </View>
  );
}
