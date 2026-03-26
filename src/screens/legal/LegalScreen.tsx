import { View, Text, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../theme/ThemeContext";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";
import type { RouteProp } from "@react-navigation/native";
import { TERMS_OF_SERVICE, PRIVACY_POLICY } from "./legalContent";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Legal">;
  route: RouteProp<RootStackParamList, "Legal">;
};

export default function LegalScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { t } = useTheme();
  const { type } = route.params;

  const isTerms = type === "terms";
  const title = isTerms ? "이용약관" : "개인정보처리방침";
  const content = isTerms ? TERMS_OF_SERVICE : PRIVACY_POLICY;

  return (
    <View className="flex-1" style={{ backgroundColor: t.bg, paddingTop: insets.top }}>
      {/* 헤더 */}
      <View className="flex-row items-center px-4 py-3" style={{ borderBottomWidth: 1, borderBottomColor: t.border }}>
        <Pressable onPress={() => navigation.goBack()} className="flex-row items-center active:opacity-60">
          <Ionicons name="chevron-back" size={24} color={t.text} />
          <Text style={{ color: t.text }} className="text-base ml-0.5">뒤로</Text>
        </Pressable>
        <Text style={{ color: t.text }} className="text-base font-bold flex-1 text-center mr-16">
          {title}
        </Text>
      </View>

      {/* 본문 */}
      <ScrollView
        className="flex-1 px-5 py-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        {content.map((section, i) => (
          <View key={i} className="mb-5">
            {section.heading && (
              <Text style={{ color: t.text }} className="text-base font-bold mb-2">
                {section.heading}
              </Text>
            )}
            <Text style={{ color: t.textSecondary, lineHeight: 22 }} className="text-sm">
              {section.body}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
