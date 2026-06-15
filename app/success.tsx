import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowRight, CheckCircle2, Car, MapPin } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { normalizeReservation } from "../lib/reservationDisplay";
import { useTheme } from "../context/ThemeContext";

export default function Success() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { reservationData } = useLocalSearchParams<{
    reservationId: string;
    reservationData?: string;
  }>();

  let plateNumber = "—";
  let locationName = "Parking Location";
  let isCheckIn = true;

  if (reservationData) {
    try {
      const res = normalizeReservation(JSON.parse(reservationData)) as any;
      if (res) {
        plateNumber = res.plateNumber || res.vehicle?.plateNumber || "—";
        locationName =
          res.locationName || res.spot?.location?.name || "Parking Location";
        isCheckIn = (res.status?.toUpperCase() ?? "ACTIVE") !== "COMPLETED";
      }
    } catch {}
  }

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-[#0f172a]" : "bg-[#f8fafc]"}`}
      edges={["top", "bottom"]}
    >
      <View className="flex-1 items-center justify-center px-6 gap-8">
        <View
          style={{
            shadowColor: "#10b981",
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 12,
          }}
          className="w-28 h-28 rounded-full bg-emerald-500 items-center justify-center"
        >
          <CheckCircle2 size={56} color="white" />
        </View>

        <View className="items-center gap-2">
          <Text
            className={`text-3xl font-black tracking-tight text-center ${
              isDark ? "text-white" : "text-[#0f172a]"
            }`}
          >
            {isCheckIn ? "Check-in Successful" : "Check-out Complete"}
          </Text>
          <Text className="text-slate-500 text-base text-center px-4">
            {isCheckIn
              ? "Vehicle has entered. Session is now active."
              : "Session closed. Driver may proceed."}
          </Text>
        </View>

        <View
          className={`w-full rounded-[28px] p-6 border gap-4 ${
            isDark
              ? "bg-[#1e293b] border-[#334155]"
              : "bg-white border-[#f1f5f9]"
          }`}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          <View className="flex-row items-center gap-4">
            <View
              className={`w-11 h-11 rounded-2xl items-center justify-center ${
                isDark ? "bg-[#0f172a]" : "bg-[#f8fafc]"
              }`}
            >
              <Car size={22} color={isDark ? "#34d399" : "#064e3b"} />
            </View>
            <View>
              <Text
                className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                PLATE
              </Text>
              <Text
                className={`text-base font-black ${
                  isDark ? "text-white" : "text-[#0f172a]"
                }`}
              >
                {plateNumber}
              </Text>
            </View>
          </View>

          <View
            className={`h-px w-full ${
              isDark ? "bg-[#334155]" : "bg-[#f1f5f9]"
            }`}
          />

          <View className="flex-row items-center gap-4">
            <View
              className={`w-11 h-11 rounded-2xl items-center justify-center ${
                isDark ? "bg-[#0f172a]" : "bg-[#f8fafc]"
              }`}
            >
              <MapPin size={22} color={isDark ? "#34d399" : "#064e3b"} />
            </View>
            <View>
              <Text
                className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                LOCATION
              </Text>
              <Text
                className={`text-base font-black ${
                  isDark ? "text-white" : "text-[#0f172a]"
                }`}
                numberOfLines={1}
              >
                {locationName}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View
        className={`p-6 pb-10 ${
          isDark ? "bg-[#0f172a]/90" : "bg-[#f8fafc]/90"
        }`}
      >
        <TouchableOpacity
          className={`h-16 rounded-2xl flex-row items-center justify-center gap-2 ${
            isDark ? "bg-[#34d399]" : "bg-[#064e3b]"
          }`}
          onPress={() => router.replace("/dashboard")}
          activeOpacity={0.8}
        >
          <Text
            className={`text-base font-black ${
              isDark ? "text-[#0f172a]" : "text-white"
            }`}
          >
            Back to Dashboard
          </Text>
          <ArrowRight size={20} color={isDark ? "#0f172a" : "white"} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
