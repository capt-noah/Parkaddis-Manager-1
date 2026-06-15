import { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing } from "react-native";
import { SHIMMER_BAND } from "./ShimmerBlock";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export function useShimmerAnimation() {
  const translateX = useRef(new Animated.Value(-SHIMMER_BAND)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: SCREEN_WIDTH,
          duration: 1800,
          easing: Easing.out(Easing.poly(3)),
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: -SHIMMER_BAND,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [translateX]);

  return translateX;
}
