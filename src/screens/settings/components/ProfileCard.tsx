import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../theme/ThemeContext";
import { Card } from "../../../components";

export default function ProfileCard() {
  const { t } = useTheme();

  return (
    <Card className="mx-5 mt-4 p-5 flex-row items-center">
      <View className="w-14 h-14 rounded-full items-center justify-center mr-4" style={{ backgroundColor: t.primaryLight }}>
        <Ionicons name="person" size={28} color={t.primary} />
      </View>
      <View className="flex-1">
        <Text style={{ color: t.text }} className="text-lg font-bold">로그인이 필요해요</Text>
        <Text style={{ color: t.textMuted }} className="text-sm mt-0.5">수입·지출 데이터를 안전하게 관리하세요</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={t.textMuted} />
    </Card>
  );
}
