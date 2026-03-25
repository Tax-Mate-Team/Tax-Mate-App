import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View, ViewProps, StyleProp, ViewStyle } from "react-native";

type FadeInProps = ViewProps & {
  delay?: number;
  duration?: number;
  children: React.ReactNode;
};

export default function FadeIn({ delay = 0, duration = 500, children, style, ...rest }: FadeInProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const flatStyle = StyleSheet.flatten(style) || {};
  const hasFlex = flatStyle.flex !== undefined;

  return (
    <Animated.View
      style={[{ opacity, transform: [{ translateY }] }, style]}
      needsOffscreenAlphaCompositing
      {...rest}
    >
      <View collapsable={false} style={hasFlex ? { flex: flatStyle.flex } : undefined}>
        {children}
      </View>
    </Animated.View>
  );
}
