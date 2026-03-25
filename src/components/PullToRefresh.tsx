import { useRef, useState, useCallback } from "react";
import { Animated, PanResponder, View, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/tokens";

type PullToRefreshProps = {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
  contentContainerStyle?: object;
  className?: string;
  style?: object;
};

const PULL_THRESHOLD = 80;

export default function PullToRefresh({ onRefresh, children, contentContainerStyle, className = "", style }: PullToRefreshProps) {
  const pullDistance = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const isRefreshing = useRef(false);

  const rotation = pullDistance.interpolate({
    inputRange: [0, PULL_THRESHOLD],
    outputRange: ["0deg", "180deg"],
    extrapolate: "clamp",
  });

  const indicatorOpacity = pullDistance.interpolate({
    inputRange: [0, 30, PULL_THRESHOLD],
    outputRange: [0, 0.6, 1],
    extrapolate: "clamp",
  });

  const indicatorScale = pullDistance.interpolate({
    inputRange: [0, PULL_THRESHOLD],
    outputRange: [0.5, 1],
    extrapolate: "clamp",
  });

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return atTop && gestureState.dy > 5 && !isRefreshing.current;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          pullDistance.setValue(gestureState.dy * 0.45);
        }
      },
      onPanResponderRelease: async (_, gestureState) => {
        const dampened = gestureState.dy * 0.45;
        if (dampened >= PULL_THRESHOLD && !isRefreshing.current) {
          isRefreshing.current = true;
          setRefreshing(true);
          Animated.spring(pullDistance, { toValue: 60, useNativeDriver: true, tension: 50, friction: 8 }).start();
          await onRefresh();
          setRefreshing(false);
          isRefreshing.current = false;
        }
        Animated.spring(pullDistance, { toValue: 0, useNativeDriver: true, tension: 40, friction: 7 }).start();
      },
    })
  ).current;

  const handleScroll = useCallback((event: any) => {
    setAtTop(event.nativeEvent.contentOffset.y <= 0);
  }, []);

  return (
    <View className={`flex-1 ${className}`} style={style} {...panResponder.panHandlers}>
      {/* Pull indicator */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          alignItems: "center", justifyContent: "center",
          height: 60, zIndex: 10,
          opacity: indicatorOpacity,
          transform: [
            { translateY: Animated.subtract(pullDistance, new Animated.Value(60)) },
            { scale: indicatorScale },
          ],
        }}
      >
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <Ionicons name={refreshing ? "refresh" : "arrow-down"} size={22} color={colors.primary[600]} />
        </Animated.View>
      </Animated.View>

      {/* Pull wrapper - only this moves, ScrollView stays normal */}
      <Animated.View style={{ flex: 1, transform: [{ translateY: pullDistance }] }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={contentContainerStyle}
        >
          {children}
        </ScrollView>
      </Animated.View>
    </View>
  );
}
