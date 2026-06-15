import React from "react";
import { View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { ShimmerBlock } from "./shimmer/ShimmerBlock";
import { useShimmerAnimation } from "./shimmer/useShimmerAnimation";

function SessionCardShimmer({
  isDark,
  translateX,
  borderColor,
  cardBg,
}: {
  isDark: boolean;
  translateX: React.ComponentProps<typeof ShimmerBlock>["translateX"];
  borderColor: string;
  cardBg: string;
}) {
  const S = (
    props: Omit<React.ComponentProps<typeof ShimmerBlock>, "translateX" | "isDark">,
  ) => <ShimmerBlock {...props} isDark={isDark} translateX={translateX} />;

  return (
    <View
      style={{
        padding: 24,
        borderRadius: 32,
        backgroundColor: cardBg,
        borderWidth: 1,
        borderColor,
        marginBottom: 24,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16, flex: 1 }}>
          <S width={48} height={48} borderRadius={16} />
          <View style={{ gap: 8, flex: 1 }}>
            <S width="70%" height={20} borderRadius={6} />
            <S width={90} height={10} borderRadius={4} style={{ opacity: 0.6 }} />
          </View>
        </View>
        <S width={56} height={22} borderRadius={11} />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingTop: 24,
          borderTopWidth: 1,
          borderStyle: "dashed",
          borderColor,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <S width={16} height={16} borderRadius={4} />
          <View style={{ gap: 6 }}>
            <S width={56} height={10} borderRadius={3} />
            <S width={72} height={14} borderRadius={4} />
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <S width={16} height={16} borderRadius={4} />
          <View style={{ gap: 6 }}>
            <S width={40} height={10} borderRadius={3} />
            <S width={80} height={14} borderRadius={4} />
          </View>
        </View>
      </View>
    </View>
  );
}

export function SessionsShimmer() {
  const { isDark } = useTheme();
  const translateX = useShimmerAnimation();
  const cardBg = isDark ? "#1e293b" : "#ffffff";
  const borderColor = isDark ? "#334155" : "#f1f5f9";

  const S = (
    props: Omit<React.ComponentProps<typeof ShimmerBlock>, "translateX" | "isDark">,
  ) => <ShimmerBlock {...props} isDark={isDark} translateX={translateX} />;

  return (
    <View className="flex-1 w-full pt-2">
      <View className="px-6 mb-4">
        <S width="100%" height={56} borderRadius={16} style={{ marginBottom: 16 }} />
      </View>

      <View
        style={{
          flexDirection: "row",
          paddingLeft: 24,
          gap: 8,
          marginBottom: 24,
        }}
      >
        {[1, 2, 3, 4].map((key) => (
          <S key={key} width={72} height={40} borderRadius={20} />
        ))}
      </View>

      <View className="px-6">
        {[1, 2, 3].map((key) => (
          <SessionCardShimmer
            key={key}
            isDark={isDark}
            translateX={translateX}
            borderColor={borderColor}
            cardBg={cardBg}
          />
        ))}
      </View>
    </View>
  );
}
