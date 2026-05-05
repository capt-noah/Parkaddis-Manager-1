import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import "./global.css";

import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

// Core tab screens share no animation; sub-pages keep native slide
const NO_ANIM = { animation: 'none' as const };

function NavigationStack() {
  const { isDark } = useTheme();
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: isDark ? "#0f172a" : "#F9FAFB" },
      }}
    >
      <Stack.Screen name="index" options={NO_ANIM} />
      <Stack.Screen name="dashboard" options={NO_ANIM} />
      <Stack.Screen name="sessions" options={NO_ANIM} />
      <Stack.Screen name="analytics" options={NO_ANIM} />
      <Stack.Screen name="manual-reservation" options={NO_ANIM} />
      <Stack.Screen name="profile" options={NO_ANIM} />
      <Stack.Screen name="scanner" options={NO_ANIM} />
      <Stack.Screen name="success" options={NO_ANIM} />
      <Stack.Screen name="checkout-success" options={NO_ANIM} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SafeAreaProvider>
          <StatusBar style="auto" />
          <NavigationStack />
        </SafeAreaProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
