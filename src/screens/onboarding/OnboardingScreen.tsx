import { useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Animated,
  Dimensions,
  type ViewToken,
  type ListRenderItemInfo,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, shadows } from "../../theme/tokens";
import { useOnboardingStore } from "../../stores/onboardingStore";
import SlideIllustration from "./SlideIllustration";
import TermsAgreement from "./TermsAgreement";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type Slide = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  accentColor: string;
  accentBg: string;
  title: string;
  subtitle: string;
  features: { icon: keyof typeof Ionicons.glyphMap; text: string }[];
};

const SLIDES: Slide[] = [
  {
    id: "income",
    icon: "wallet-outline",
    accentColor: colors.primary[600],
    accentBg: colors.primary[50],
    title: "수입을 한눈에",
    subtitle: "건별 수입을 등록하면\n원천징수 3.3%가 자동 계산돼요",
    features: [
      { icon: "add-circle-outline", text: "간편한 수입 등록" },
      { icon: "calculator-outline", text: "3.3% 자동 계산" },
      { icon: "bar-chart-outline", text: "월별 수입 차트" },
    ],
  },
  {
    id: "tax",
    icon: "receipt-outline",
    accentColor: colors.success[500],
    accentBg: colors.success[50],
    title: "세금, 미리 알려드려요",
    subtitle: "5월 종합소득세,\n얼마나 내야 할지 예측해 드려요",
    features: [
      { icon: "analytics-outline", text: "종소세 예상 금액" },
      { icon: "trending-down-outline", text: "환급 / 추가납부 예측" },
      { icon: "shield-checkmark-outline", text: "비로그인으로 바로 계산" },
    ],
  },
  {
    id: "manage",
    icon: "pie-chart-outline",
    accentColor: colors.purple[500],
    accentBg: "#F5F3FF",
    title: "경비도 똑똑하게",
    subtitle: "지출을 카테고리별로 관리하면\n절세에 도움이 돼요",
    features: [
      { icon: "pricetag-outline", text: "12가지 지출 카테고리" },
      { icon: "document-text-outline", text: "경비 처리 가능 분류" },
      { icon: "calendar-outline", text: "연간 리포트 제공" },
    ],
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollXJs = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTerms, setShowTerms] = useState(false);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    [],
  );

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const goNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      setShowTerms(true);
    }
  };

  const isLast = currentIndex === SLIDES.length - 1;

  if (showTerms) {
    return <TermsAgreement onComplete={completeOnboarding} />;
  }

  const renderSlide = ({ item, index }: ListRenderItemInfo<Slide>) => (
    <View style={{ width: SCREEN_WIDTH, flex: 1, paddingHorizontal: 32 }}>
      <View className="flex-1 justify-center items-center">
        <SlideIllustration slide={item} index={index} scrollX={scrollX} />
      </View>
      <View className="mb-4">
        <Text className="text-3xl font-bold text-center" style={{ color: colors.gray[900], lineHeight: 40 }}>
          {item.title}
        </Text>
        <Text className="text-base text-center mt-3" style={{ color: colors.gray[500], lineHeight: 24 }}>
          {item.subtitle}
        </Text>
        <View className="flex-row flex-wrap justify-center mt-6 gap-2">
          {item.features.map((f) => (
            <View
              key={f.text}
              className="flex-row items-center px-3.5 py-2 rounded-full"
              style={{ backgroundColor: item.accentBg }}
            >
              <Ionicons name={f.icon} size={14} color={item.accentColor} style={{ marginRight: 5 }} />
              <Text className="text-xs font-semibold" style={{ color: item.accentColor }}>{f.text}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: colors.white, paddingTop: insets.top }}>
      <View className="flex-row justify-end px-6 py-3">
        {!isLast && (
          <Pressable onPress={() => setShowTerms(true)} className="px-3 py-1.5 active:opacity-60">
            <Text className="text-sm font-medium" style={{ color: colors.gray[400] }}>건너뛰기</Text>
          </Pressable>
        )}
      </View>

      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const x = e.nativeEvent.contentOffset.x;
          scrollX.setValue(x);
          scrollXJs.setValue(x);
        }}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      <View style={{ paddingBottom: insets.bottom + 16 }} className="px-8">
        <View className="flex-row justify-center items-center mb-8">
          {SLIDES.map((_, i) => {
            const inputRange = [(i - 1) * SCREEN_WIDTH, i * SCREEN_WIDTH, (i + 1) * SCREEN_WIDTH];
            const dotWidth = scrollXJs.interpolate({ inputRange, outputRange: [8, 24, 8], extrapolate: "clamp" });
            const dotOpacity = scrollXJs.interpolate({ inputRange, outputRange: [0.3, 1, 0.3], extrapolate: "clamp" });
            return (
              <Animated.View
                key={i}
                style={{
                  width: dotWidth, height: 8, borderRadius: 4, marginHorizontal: 4,
                  backgroundColor: SLIDES[currentIndex]?.accentColor ?? colors.primary[600],
                  opacity: dotOpacity,
                }}
              />
            );
          })}
        </View>

        <Pressable
          onPress={goNext}
          className="rounded-2xl items-center active:opacity-90"
          style={[
            { backgroundColor: SLIDES[currentIndex]?.accentColor ?? colors.primary[600], paddingVertical: 18 },
            shadows.colored(SLIDES[currentIndex]?.accentColor ?? colors.primary[600]),
          ]}
        >
          <Text className="text-base font-bold" style={{ color: colors.white }}>
            {isLast ? "시작하기" : "다음"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
