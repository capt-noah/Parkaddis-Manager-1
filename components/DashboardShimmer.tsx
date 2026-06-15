import React from "react";
import { View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { ShimmerBlock } from "./shimmer/ShimmerBlock";
import { useShimmerAnimation } from "./shimmer/useShimmerAnimation";

export function DashboardShimmer() {
  const { isDark } = useTheme();
  const translateX = useShimmerAnimation();

  const cardBg = isDark ? "#1e293b" : "#ffffff";
  const cardBorder = isDark ? "#334155" : "#f1f5f9";

  const S = (
    props: Omit<React.ComponentProps<typeof ShimmerBlock>, "translateX" | "isDark">
  ) => <ShimmerBlock {...props} isDark={isDark} translateX={translateX} />;

  return (
    <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 100 }}>

      {/* Welcome text — "Welcome Back" + name */}
      <View style={{ marginBottom: 24, marginTop: 16, gap: 8 }}>
        <S width={120} height={14} borderRadius={6} />
        <S width={220} height={32} borderRadius={10} />
      </View>

      {/* Scan card — large hero button */}
      <View
        style={{
          height: 120,
          borderRadius: 28,
          backgroundColor: isDark ? "#334155" : "#e2e8f0",
          marginBottom: 16,
          padding: 24,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <View style={{ gap: 10, flex: 1 }}>
          <S width={100} height={11} borderRadius={4} />
          <S width={170} height={26} borderRadius={8} />
        </View>
        <S width={80} height={80} borderRadius={24} />
      </View>

      {/* Single full-width action button — Register Walk-in */}
      <S width="100%" height={56} borderRadius={24} style={{ marginBottom: 24 }} />

      {/* Stats row — Revenue / Available */}
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 32 }}>
        {[0, 1].map((i) => (
          <View
            key={i}
            style={{
              flex: 1,
              padding: 20,
              borderRadius: 28,
              backgroundColor: cardBg,
              borderWidth: 1,
              borderColor: cardBorder,
            }}
          >
            <S width={65} height={10} borderRadius={4} style={{ marginBottom: 12 }} />
            <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 4 }}>
              <S width={70} height={30} borderRadius={8} />
              <S width={28} height={14} borderRadius={4} style={{ marginBottom: 4 }} />
            </View>
          </View>
        ))}
      </View>

      {/* Live Feed header row */}
      <View
        style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}
      >
        <View style={{ gap: 6 }}>
          <S width={90} height={22} borderRadius={8} />
          <S width={160} height={12} borderRadius={4} />
        </View>
        <S width={68} height={28} borderRadius={12} />
      </View>

      {/* Live feed session cards — matches actual card layout */}
      <View style={{ gap: 12 }}>
        {[1, 2, 3].map((key) => (
          <View
            key={key}
            style={{
              padding: 20,
              borderRadius: 28,
              borderWidth: 1,
              borderColor: cardBorder,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: cardBg,
            }}
          >
            {/* Left: icon + plate + status dot */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 16, flex: 1 }}>
              <S width={48} height={48} borderRadius={16} />
              <View style={{ flex: 1, gap: 8 }}>
                <S width="70%" height={16} borderRadius={6} />
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <S width={6} height={6} borderRadius={3} />
                  <S width={110} height={10} borderRadius={4} />
                </View>
              </View>
            </View>
            {/* Right: ETB label + amount */}
            <View style={{ alignItems: "flex-end", gap: 4 }}>
              <S width={28} height={10} borderRadius={4} />
              <S width={52} height={22} borderRadius={6} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
