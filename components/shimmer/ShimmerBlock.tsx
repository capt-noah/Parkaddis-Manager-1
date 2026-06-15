import React from "react";
import { View, Animated, StyleProp, ViewStyle, DimensionValue } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export const SHIMMER_BAND = 160;

type ShimmerBlockProps = {
  width: DimensionValue;
  height: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  translateX: Animated.Value;
};

export function ShimmerBlock({
  width,
  height,
  borderRadius = 8,
  style,
  isDark = false,
  translateX,
}: ShimmerBlockProps) {
  // Higher contrast: dark mode uses slate-700 base with white streak,
  // light mode uses slate-200 base with white streak
  const baseColor = isDark ? "#334155" : "#e2e8f0";
  const streakColors: [string, string, string] = isDark
    ? ["transparent", "rgba(255,255,255,0.12)", "transparent"]
    : ["transparent", "rgba(255,255,255,0.75)", "transparent"];

  return (
    <View
      style={[
        { width, height, borderRadius, backgroundColor: baseColor, overflow: "hidden" },
        style,
      ]}
    >
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: SHIMMER_BAND * 2.5,
          transform: [{ translateX }],
        }}
      >
        <LinearGradient
          colors={streakColors}
          locations={[0.1, 0.5, 0.9]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ flex: 1, width: "100%", height: "100%" }}
        />
      </Animated.View>
    </View>
  );
}
