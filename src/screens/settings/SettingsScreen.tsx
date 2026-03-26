import { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { colors } from "../../theme/tokens";
import { useTheme } from "../../theme/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { useOnboardingStore } from "../../stores/onboardingStore";
import { ScreenHeader, FadeIn } from "../../components";
import ProfileCard from "./components/ProfileCard";
import MenuSection from "./components/MenuSection";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, toggle, t } = useTheme();
  const { isLoggedIn, logout } = useAuth();
  const { showToast } = useToast();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const resetOnboarding = useOnboardingStore((s) => s.reset);

  const handleLogout = () => {
    logout();
    queryClient.clear();
    showToast("로그아웃 되었습니다", "info");
  };

  const MENU_SECTIONS = [
    {
      title: "계정",
      items: isLoggedIn
        ? [
            { icon: "log-out-outline" as const, label: "로그아웃", color: colors.danger[500], onPress: handleLogout },
          ]
        : [
            { icon: "person-outline" as const, label: "로그인 / 회원가입", sub: "수입·지출을 저장하고 관리하세요", color: colors.primary[600], onPress: () => navigation.navigate("Login") },
          ],
    },
    {
      title: "세금 도움",
      items: [
        { icon: "book-outline" as const, label: "프리랜서 세금 가이드", sub: "3.3%, 종소세 기본 개념", color: colors.success[500] },
        { icon: "calendar-outline" as const, label: "세금 일정", sub: "부가세, 종소세 신고 기간", color: colors.warning[500] },
        { icon: "pie-chart-outline" as const, label: "경비율 안내", sub: "업종별 단순경비율·기준경비율", color: colors.purple[500] },
      ],
    },
    {
      title: "앱 설정",
      items: [
        {
          icon: "notifications-outline" as const,
          label: "알림 설정",
          color: colors.gray[500],
          toggle: { value: notificationEnabled, onValueChange: setNotificationEnabled },
        },
        {
          icon: "moon-outline" as const,
          label: "다크 모드",
          color: isDark ? colors.primary[400] : colors.gray[500],
          toggle: { value: isDark, onValueChange: () => toggle() },
        },
        { icon: "information-circle-outline" as const, label: "앱 정보", sub: "v1.0.0", color: colors.gray[500] },
      ],
    },
    {
      title: "약관 및 정책",
      items: [
        { icon: "document-text-outline" as const, label: "이용약관", color: colors.gray[500], onPress: () => navigation.navigate("Legal", { type: "terms" }) },
        { icon: "shield-outline" as const, label: "개인정보처리방침", color: colors.gray[500], onPress: () => navigation.navigate("Legal", { type: "privacy" }) },
      ],
    },
    ...(__DEV__ ? [{
      title: "개발자 도구",
      items: [
        {
          icon: "refresh-outline" as const,
          label: "온보딩 초기화",
          sub: "앱 재시작 시 온보딩이 다시 표시됩니다",
          color: colors.warning[500],
          onPress: () => { resetOnboarding(); showToast("온보딩이 초기화되었습니다. 앱을 재시작하세요", "info"); },
        },
      ],
    }] : []),
  ];

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: t.bg }}
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader title="설정" />
      <FadeIn delay={0}><ProfileCard /></FadeIn>
      {MENU_SECTIONS.map((section, si) => (
        <FadeIn key={section.title} delay={80 + si * 80}>
          <MenuSection title={section.title} items={section.items} />
        </FadeIn>
      ))}
      <View className="mt-8 items-center">
        <Text style={{ color: t.textMuted }} className="text-xs">Tax Mate v1.0.0</Text>
        <Text style={{ color: t.textMuted }} className="text-xs mt-1">프리랜서를 위한 세금 메이트</Text>
      </View>
    </ScrollView>
  );
}
