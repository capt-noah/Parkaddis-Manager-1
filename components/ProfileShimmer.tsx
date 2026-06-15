import React from "react";
import { View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { ShimmerBlock } from "./shimmer/ShimmerBlock";
import { useShimmerAnimation } from "./shimmer/useShimmerAnimation";

export function ProfileShimmer() {
  const { isDark } = useTheme();
  const translateX = useShimmerAnimation();

  const cardBg = isDark ? "#1e293b" : "#ffffff";
  const cardBorder = isDark ? "#334155" : "#f1f5f9";

  const S = (
    props: Omit<React.ComponentProps<typeof ShimmerBlock>, "translateX" | "isDark">
  ) => <ShimmerBlock {...props} isDark={isDark} translateX={translateX} />;

  return (
    <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 16 }}>
      {/* Profile Header Skeleton */}
      <View style={{ alignItems: "center", marginTop: 24, marginBottom: 40 }}>
         <S width={112} height={112} borderRadius={40} />
         <View style={{ alignItems: "center", marginTop: 16 }}>
            <S width={160} height={32} borderRadius={8} style={{ marginBottom: 8 }} />
            <S width={128} height={16} borderRadius={4} />
         </View>
      </View>

      {/* Shift History Group */}
      <View style={{ marginBottom: 32 }}>
        <S width={128} height={16} borderRadius={4} style={{ marginBottom: 16, marginLeft: 8 }} />
        <View style={{ backgroundColor: cardBg, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: cardBorder }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <S width={40} height={40} borderRadius={16} />
            <View style={{ flex: 1 }}>
              <S width={192} height={16} borderRadius={4} style={{ marginBottom: 8 }} />
              <S width={128} height={12} borderRadius={4} />
            </View>
          </View>
        </View>
      </View>

      {/* Station Reports Group */}
      <View style={{ marginBottom: 32 }}>
        <S width={128} height={16} borderRadius={4} style={{ marginBottom: 16, marginLeft: 8 }} />
        <View style={{ backgroundColor: cardBg, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: cardBorder }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <S width={40} height={40} borderRadius={16} />
            <View style={{ flex: 1 }}>
              <S width={192} height={16} borderRadius={4} style={{ marginBottom: 8 }} />
              <S width={128} height={12} borderRadius={4} />
            </View>
          </View>
        </View>
      </View>

      {/* Settings Group */}
      <View>
        <S width={128} height={16} borderRadius={4} style={{ marginBottom: 16, marginLeft: 8 }} />
        <View style={{ backgroundColor: cardBg, borderRadius: 24, overflow: "hidden", borderWidth: 1, borderColor: cardBorder }}>
          {[1, 2].map((i) => (
            <View key={i} style={{ padding: 20, borderBottomWidth: i === 1 ? 1 : 0, borderBottomColor: cardBorder }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                <S width={40} height={40} borderRadius={16} />
                <View style={{ flex: 1 }}>
                  <S width={192} height={16} borderRadius={4} style={{ marginBottom: 8 }} />
                  <S width={128} height={12} borderRadius={4} />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
