import { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView, BackHandler } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, shadows } from "../../theme/tokens";
import { useOnboardingStore } from "../../stores/onboardingStore";
import { TERMS_OF_SERVICE, PRIVACY_POLICY } from "../legal/legalContent";

type Props = {
  onComplete: () => void;
};

type ViewingDoc = "terms" | "privacy" | null;

export default function TermsAgreement({ onComplete }: Props) {
  const insets = useSafeAreaInsets();
  const agreeTerms = useOnboardingStore((s) => s.agreeTerms);
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeService, setAgreeService] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [viewing, setViewing] = useState<ViewingDoc>(null);

  // 안드로이드 뒤로가기 처리
  useEffect(() => {
    const handler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (viewing) {
        setViewing(null);
        return true;
      }
      return false;
    });
    return () => handler.remove();
  }, [viewing]);

  const handleAgreeAll = () => {
    const next = !agreeAll;
    setAgreeAll(next);
    setAgreeService(next);
    setAgreePrivacy(next);
  };

  const handleToggle = (type: "service" | "privacy") => {
    if (type === "service") {
      const next = !agreeService;
      setAgreeService(next);
      setAgreeAll(next && agreePrivacy);
    } else {
      const next = !agreePrivacy;
      setAgreePrivacy(next);
      setAgreeAll(agreeService && next);
    }
  };

  const canProceed = agreeService && agreePrivacy;

  const handleStart = () => {
    agreeTerms();
    onComplete();
  };

  // 약관/개인정보처리방침 전문 보기
  if (viewing) {
    const isTerms = viewing === "terms";
    const title = isTerms ? "이용약관" : "개인정보처리방침";
    const content = isTerms ? TERMS_OF_SERVICE : PRIVACY_POLICY;

    return (
      <View className="flex-1" style={{ backgroundColor: colors.white, paddingTop: insets.top }}>
        <View className="flex-row items-center px-4 py-3" style={{ borderBottomWidth: 1, borderBottomColor: colors.gray[100] }}>
          <Pressable onPress={() => setViewing(null)} className="flex-row items-center active:opacity-60">
            <Ionicons name="chevron-back" size={24} color={colors.gray[900]} />
            <Text className="text-base ml-0.5" style={{ color: colors.gray[900] }}>뒤로</Text>
          </Pressable>
          <Text className="text-base font-bold flex-1 text-center mr-16" style={{ color: colors.gray[900] }}>
            {title}
          </Text>
        </View>
        <ScrollView
          className="flex-1 px-5 py-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        >
          {content.map((section, i) => (
            <View key={i} className="mb-5">
              {section.heading && (
                <Text className="text-base font-bold mb-2" style={{ color: colors.gray[900] }}>
                  {section.heading}
                </Text>
              )}
              <Text className="text-sm" style={{ color: colors.gray[500], lineHeight: 22 }}>
                {section.body}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.white, paddingTop: insets.top }}>
      <View className="flex-1 px-8 justify-center">
        <View className="mb-10">
          <View
            className="w-16 h-16 rounded-2xl items-center justify-center mb-6"
            style={[{ backgroundColor: colors.primary[600] }, shadows.md]}
          >
            <Ionicons name="shield-checkmark" size={32} color={colors.white} />
          </View>
          <Text className="text-2xl font-bold" style={{ color: colors.gray[900] }}>
            서비스 이용을 위해{"\n"}약관에 동의해주세요
          </Text>
          <Text className="text-sm mt-2" style={{ color: colors.gray[500] }}>
            아래 약관에 동의하시면 Tax Mate를 시작할 수 있어요
          </Text>
        </View>

        {/* 전체 동의 */}
        <Pressable
          onPress={handleAgreeAll}
          className="flex-row items-center p-4 rounded-2xl mb-3"
          style={{ backgroundColor: agreeAll ? colors.primary[50] : colors.gray[50], borderWidth: 1.5, borderColor: agreeAll ? colors.primary[600] : colors.gray[200] }}
        >
          <View
            className="w-6 h-6 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: agreeAll ? colors.primary[600] : colors.gray[200] }}
          >
            <Ionicons name="checkmark" size={16} color={colors.white} />
          </View>
          <Text className="text-base font-bold flex-1" style={{ color: agreeAll ? colors.primary[600] : colors.gray[900] }}>
            전체 동의하기
          </Text>
        </Pressable>

        <View className="rounded-2xl overflow-hidden" style={{ backgroundColor: colors.gray[50] }}>
          {/* 이용약관 */}
          <View className="flex-row items-center px-4 py-3.5" style={{ borderBottomWidth: 1, borderBottomColor: colors.gray[100] }}>
            <Pressable onPress={() => handleToggle("service")} className="flex-row items-center flex-1">
              <View
                className="w-5 h-5 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: agreeService ? colors.primary[600] : colors.gray[300] }}
              >
                <Ionicons name="checkmark" size={13} color={colors.white} />
              </View>
              <Text className="text-sm" style={{ color: colors.gray[700] }}>
                <Text className="font-medium" style={{ color: colors.primary[600] }}>[필수]</Text>
                {"  "}이용약관 동의
              </Text>
            </Pressable>
            <Pressable onPress={() => setViewing("terms")} className="px-2 py-1 active:opacity-60">
              <Text className="text-xs font-medium" style={{ color: colors.gray[400] }}>보기</Text>
            </Pressable>
          </View>

          {/* 개인정보처리방침 */}
          <View className="flex-row items-center px-4 py-3.5">
            <Pressable onPress={() => handleToggle("privacy")} className="flex-row items-center flex-1">
              <View
                className="w-5 h-5 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: agreePrivacy ? colors.primary[600] : colors.gray[300] }}
              >
                <Ionicons name="checkmark" size={13} color={colors.white} />
              </View>
              <Text className="text-sm" style={{ color: colors.gray[700] }}>
                <Text className="font-medium" style={{ color: colors.primary[600] }}>[필수]</Text>
                {"  "}개인정보처리방침 동의
              </Text>
            </Pressable>
            <Pressable onPress={() => setViewing("privacy")} className="px-2 py-1 active:opacity-60">
              <Text className="text-xs font-medium" style={{ color: colors.gray[400] }}>보기</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* 하단 버튼 */}
      <View style={{ paddingBottom: insets.bottom + 16 }} className="px-8">
        <Pressable
          onPress={handleStart}
          disabled={!canProceed}
          className="rounded-2xl items-center active:opacity-90"
          style={[
            {
              backgroundColor: canProceed ? colors.primary[600] : colors.gray[200],
              paddingVertical: 18,
            },
            canProceed ? shadows.colored(colors.primary[600]) : {},
          ]}
        >
          <Text className="text-base font-bold" style={{ color: canProceed ? colors.white : colors.gray[400] }}>
            동의하고 시작하기
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
