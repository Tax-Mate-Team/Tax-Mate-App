import { type ReactNode } from "react";
import { View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../theme/ThemeContext";
import { useToast } from "../../contexts/ToastContext";
import { colors, shadows } from "../../theme/tokens";
import { FadeIn } from "../../components";
import GoogleLogo from "./GoogleLogo";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
};

type SocialProvider = {
  id: string;
  label: string;
  renderIcon: (isDark: boolean) => ReactNode;
  bg: string;
  darkBg?: string;
  text: string;
  darkText?: string;
  borderColor?: string;
};

const SOCIAL_PROVIDERS: SocialProvider[] = [
  {
    id: "kakao",
    label: "카카오로 시작하기",
    renderIcon: () => <Ionicons name="chatbubble" size={20} color="#191919" />,
    bg: "#FEE500",
    text: "#191919",
  },
  {
    id: "naver",
    label: "네이버로 시작하기",
    renderIcon: () => <Text style={{ fontSize: 16, fontWeight: "900", color: "#FFFFFF" }}>N</Text>,
    bg: "#03C75A",
    text: "#FFFFFF",
  },
  {
    id: "google",
    label: "Google로 시작하기",
    renderIcon: () => <GoogleLogo size={20} />,
    bg: "#FFFFFF",
    darkBg: "#1E1E36",
    text: "#374151",
    darkText: "#E2E8F0",
    borderColor: "#E5E7EB",
  },
  {
    id: "apple",
    label: "Apple로 시작하기",
    renderIcon: () => <Ionicons name="logo-apple" size={20} color="#FFFFFF" />,
    bg: "#000000",
    text: "#FFFFFF",
  },
];

export default function LoginScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { t, isDark } = useTheme();
  const { showToast } = useToast();

  const handleSocialLogin = (provider: SocialProvider) => {
    showToast(`${provider.label} - 준비 중입니다`, "info");
  };

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: t.bg, paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {/* 네비게이션 바 */}
      <View className="px-4 py-3 flex-row items-center">
        <Pressable
          onPress={() => navigation.goBack()}
          className="flex-row items-center active:opacity-60"
        >
          <Ionicons name="chevron-back" size={24} color={t.text} />
          <Text style={{ color: t.text }} className="text-base ml-0.5">뒤로</Text>
        </Pressable>
      </View>

      {/* 브랜딩 */}
      <View className="flex-1 justify-center px-8">
        <FadeIn delay={0}>
          <View className="items-center mb-12">
            <View
              className="w-20 h-20 rounded-3xl items-center justify-center mb-6"
              style={[{ backgroundColor: colors.primary[600] }, shadows.lg]}
            >
              <Ionicons name="calculator" size={36} color="#FFFFFF" />
            </View>
            <Text style={{ color: t.text }} className="text-3xl font-bold text-center">
              Tax Mate
            </Text>
            <Text style={{ color: t.textMuted }} className="text-base mt-2 text-center">
              프리랜서를 위한 똑똑한 세금 관리
            </Text>
          </View>
        </FadeIn>

        {/* 소셜 로그인 버튼 */}
        <FadeIn delay={150}>
          <View className="gap-3">
            {SOCIAL_PROVIDERS.map((provider) => {
              const bgColor = isDark && provider.darkBg ? provider.darkBg : provider.bg;
              const textColor = isDark && provider.darkText ? provider.darkText : provider.text;

              return (
                <Pressable
                  key={provider.id}
                  onPress={() => handleSocialLogin(provider)}
                  className="flex-row items-center justify-center rounded-2xl py-4 active:opacity-80"
                  style={[
                    { backgroundColor: bgColor },
                    provider.borderColor
                      ? { borderWidth: 1, borderColor: isDark ? "#374151" : provider.borderColor }
                      : {},
                  ]}
                >
                  <View style={{ marginRight: 10 }}>
                    {provider.renderIcon(isDark)}
                  </View>
                  <Text className="text-base font-semibold" style={{ color: textColor }}>
                    {provider.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </FadeIn>
      </View>

      {/* 하단 안내 */}
      <FadeIn delay={300}>
        <View className="px-8 pb-4 items-center">
          <Text style={{ color: t.textMuted }} className="text-xs text-center leading-5">
            로그인 시{" "}
            <Text style={{ color: t.primaryText }} className="font-medium">이용약관</Text>
            {" "}및{" "}
            <Text style={{ color: t.primaryText }} className="font-medium">개인정보처리방침</Text>
            에 동의하게 됩니다.
          </Text>
        </View>
      </FadeIn>
    </View>
  );
}
