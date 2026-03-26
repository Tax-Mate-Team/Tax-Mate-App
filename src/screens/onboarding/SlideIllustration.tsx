import { useRef, useEffect } from "react";
import { View, Animated, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, shadows } from "../../theme/tokens";
import Svg, { Circle as SvgCircle, Defs, LinearGradient, Stop } from "react-native-svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type SlideData = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  accentColor: string;
  accentBg: string;
};

type Props = {
  slide: SlideData;
  index: number;
  scrollX: Animated.Value;
};

function FloatingIcon({
  name,
  size,
  color,
  bg,
  style,
  delay = 0,
}: {
  name: keyof typeof Ionicons.glyphMap;
  size: number;
  color: string;
  bg: string;
  style?: any;
  delay?: number;
}) {
  const float = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 600,
      delay: delay + 200,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: -8, duration: 2000 + delay * 2, useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 2000 + delay * 2, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  const boxSize = size * 2.2;

  return (
    <Animated.View
      style={[
        {
          width: boxSize,
          height: boxSize,
          borderRadius: boxSize * 0.3,
          backgroundColor: bg,
          alignItems: "center",
          justifyContent: "center",
          opacity: fadeIn,
          transform: [{ translateY: float }],
        },
        shadows.md,
        style,
      ]}
    >
      <Ionicons name={name} size={size} color={color} />
    </Animated.View>
  );
}

export default function SlideIllustration({ slide, index, scrollX }: Props) {
  const scale = scrollX.interpolate({
    inputRange: [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
    outputRange: [0.7, 1, 0.7],
    extrapolate: "clamp",
  });

  const opacity = scrollX.interpolate({
    inputRange: [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
    outputRange: [0, 1, 0],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={{ width: 280, height: 280, alignItems: "center", justifyContent: "center", transform: [{ scale }], opacity }}
    >
      {/* 배경 원 */}
      <View style={{ position: "absolute" }}>
        <Svg width={260} height={260}>
          <Defs>
            <LinearGradient id={`grad-${slide.id}`} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={slide.accentColor} stopOpacity="0.08" />
              <Stop offset="1" stopColor={slide.accentColor} stopOpacity="0.02" />
            </LinearGradient>
          </Defs>
          <SvgCircle cx={130} cy={130} r={130} fill={`url(#grad-${slide.id})`} />
          <SvgCircle cx={130} cy={130} r={90} fill={`url(#grad-${slide.id})`} />
        </Svg>
      </View>

      {/* 중앙 메인 아이콘 */}
      <View
        style={[
          {
            width: 96,
            height: 96,
            borderRadius: 32,
            backgroundColor: slide.accentColor,
            alignItems: "center",
            justifyContent: "center",
          },
          shadows.lg,
        ]}
      >
        <Ionicons name={slide.icon} size={44} color={colors.white} />
      </View>

      {/* 슬라이드별 플로팅 아이콘 배치 */}
      {slide.id === "income" && (
        <>
          <FloatingIcon
            name="cash-outline"
            size={20}
            color={colors.success[500]}
            bg={colors.success[50]}
            style={{ position: "absolute", top: 20, right: 20 }}
            delay={0}
          />
          <FloatingIcon
            name="trending-up-outline"
            size={18}
            color={colors.primary[600]}
            bg={colors.primary[50]}
            style={{ position: "absolute", top: 50, left: 10 }}
            delay={150}
          />
          <FloatingIcon
            name="card-outline"
            size={16}
            color={colors.warning[500]}
            bg={colors.warning[50]}
            style={{ position: "absolute", bottom: 30, left: 20 }}
            delay={300}
          />
          <FloatingIcon
            name="stats-chart-outline"
            size={18}
            color={colors.primary[500]}
            bg={colors.primary[50]}
            style={{ position: "absolute", bottom: 40, right: 10 }}
            delay={200}
          />
        </>
      )}

      {slide.id === "tax" && (
        <>
          <FloatingIcon
            name="calculator-outline"
            size={20}
            color={colors.primary[600]}
            bg={colors.primary[50]}
            style={{ position: "absolute", top: 15, left: 25 }}
            delay={0}
          />
          <FloatingIcon
            name="document-text-outline"
            size={18}
            color={colors.success[500]}
            bg={colors.success[50]}
            style={{ position: "absolute", top: 40, right: 10 }}
            delay={200}
          />
          <FloatingIcon
            name="arrow-down-circle-outline"
            size={16}
            color={colors.danger[500]}
            bg={colors.danger[50]}
            style={{ position: "absolute", bottom: 35, right: 25 }}
            delay={100}
          />
          <FloatingIcon
            name="checkmark-circle-outline"
            size={18}
            color={colors.success[500]}
            bg={colors.success[50]}
            style={{ position: "absolute", bottom: 25, left: 15 }}
            delay={250}
          />
        </>
      )}

      {slide.id === "manage" && (
        <>
          <FloatingIcon
            name="folder-outline"
            size={20}
            color={colors.purple[500]}
            bg="#F5F3FF"
            style={{ position: "absolute", top: 20, right: 15 }}
            delay={100}
          />
          <FloatingIcon
            name="pricetag-outline"
            size={16}
            color={colors.warning[500]}
            bg={colors.warning[50]}
            style={{ position: "absolute", top: 45, left: 15 }}
            delay={0}
          />
          <FloatingIcon
            name="shield-checkmark-outline"
            size={18}
            color={colors.success[500]}
            bg={colors.success[50]}
            style={{ position: "absolute", bottom: 20, left: 25 }}
            delay={200}
          />
          <FloatingIcon
            name="analytics-outline"
            size={18}
            color={colors.primary[600]}
            bg={colors.primary[50]}
            style={{ position: "absolute", bottom: 40, right: 15 }}
            delay={150}
          />
        </>
      )}
    </Animated.View>
  );
}
