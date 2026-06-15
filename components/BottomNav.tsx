import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import { useRouter, useSegments } from "expo-router";
import { LayoutDashboard, History, User } from "lucide-react-native";
import { BlurView } from "expo-blur";
import { useTheme } from "../context/ThemeContext";

export default function BottomNav() {
  const router = useRouter();
  const segments = useSegments();
  const { isDark } = useTheme();

  // Safely determine current tab
  const getActiveTab = () => {
    try {
      const segs = segments as string[];
      if (!segs || segs.length === 0) return "dashboard";
      const root = segs[0];
      if (root === "(tabs)" || root === "dashboard") return "dashboard";
      if (root === "scanner") return "scanner";
      if (root === "sessions") return "sessions";
      if (root === "analytics") return "analytics";
      if (root === "profile") return "profile";
      return root;
    } catch (e) {
      return "dashboard";
    }
  };

  const activeTab = getActiveTab();

  const navItems = [
    {
      id: "dashboard",
      label: "Home",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    { id: "sessions", label: "Sessions", icon: History, path: "/sessions" },
    { id: "profile", label: "Profile", icon: User, path: "/profile" },
  ];

  return (
    <View
      className="absolute bottom-0 left-0 right-0 overflow-hidden"
      style={styles.navContainer}
    >
      <BlurView
        intensity={isDark ? 80 : 100}
        tint={isDark ? "dark" : "light"}
        style={StyleSheet.absoluteFill}
      />
      <View
        className="px-6 pb-8 pt-4 border-t border-slate-100/50 dark:border-slate-800/50 flex-row items-center justify-between"
        style={{
          backgroundColor: isDark
            ? "rgba(15, 23, 42, 0.7)"
            : "rgba(255, 255, 255, 0.7)",
        }}
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;

          if (item.isAction) {
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => router.push(item.path as any)}
                className="w-14 h-14 bg-primary dark:bg-emerald-800 rounded-2xl items-center justify-center -mt-10 shadow-lg shadow-primary/30"
              >
                <item.icon size={28} color="white" />
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => router.push(item.path as any)}
              className="items-center py-2 px-3 rounded-2xl"
            >
              <item.icon
                size={22}
                color={isActive ? (isDark ? "#10b981" : "#064e3b") : "#94A3B8"}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <Text
                className={`text-[10px] font-bold mt-1 uppercase tracking-widest ${isActive ? (isDark ? "text-emerald-500" : "text-primary") : "text-slate-400 dark:text-slate-500"}`}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
});
