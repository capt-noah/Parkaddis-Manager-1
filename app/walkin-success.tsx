import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { CheckCircle2, Home, QrCode, Car } from "lucide-react-native";
import { useClerkShiftGuard } from "../hooks/useClerkShiftGuard";

export default function WalkinSuccess() {
  const router = useRouter();
  const { guardAction, ShiftGuardModal } = useClerkShiftGuard();
  const { fullName, plateNumber, reservationId } = useLocalSearchParams<{
    fullName?: string;
    plateNumber?: string;
    reservationId?: string;
  }>();

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-slate-900"
      edges={["top", "bottom"]}
    >
      <View className="flex-1 px-6 pt-12 items-center justify-center">
        <View className="w-28 h-28 rounded-full bg-emerald-100 dark:bg-emerald-900/30 items-center justify-center mb-8">
          <CheckCircle2 size={56} color="#059669" />
        </View>
        <Text className="text-3xl font-headline font-bold text-slate-900 dark:text-white text-center mb-3">
          Walk-in Registered
        </Text>
        <Text className="text-sm text-slate-500 dark:text-slate-400 text-center mb-8 px-4">
          The guest and vehicle have been registered. A reservation is ready for
          check-in.
        </Text>

        <View className="w-full bg-white dark:bg-slate-800 rounded-[28px] p-6 border border-slate-100 dark:border-slate-700 mb-8 gap-4">
          {fullName ? (
            <View>
              <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                Guest
              </Text>
              <Text className="text-xl font-headline font-bold text-slate-900 dark:text-white">
                {fullName}
              </Text>
            </View>
          ) : null}
          {plateNumber ? (
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 bg-slate-50 dark:bg-slate-700 rounded-2xl items-center justify-center">
                <Car size={24} color="#064e3b" />
              </View>
              <View>
                <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                  Plate Number
                </Text>
                <Text className="text-xl font-headline font-bold text-slate-900 dark:text-white">
                  {plateNumber}
                </Text>
              </View>
            </View>
          ) : null}
          {reservationId ? (
            <Text className="text-[10px] text-slate-400 uppercase tracking-wider">
              Reservation: {reservationId.substring(0, 8)}
            </Text>
          ) : null}
        </View>

        <TouchableOpacity
          onPress={() => guardAction(() => router.push("/scanner"))}
          className="w-full bg-primary dark:bg-emerald-800 py-4 rounded-2xl items-center justify-center flex-row gap-2 mb-4"
        >
          <QrCode size={20} color="white" />
          <Text className="text-white font-bold text-base">Scan to Check In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/dashboard")}
          className="w-full bg-slate-100 dark:bg-slate-800 py-4 rounded-2xl items-center justify-center flex-row gap-2"
        >
          <Home size={20} color="#475569" />
          <Text className="text-slate-700 dark:text-slate-300 font-bold text-base">
            Back to Dashboard
          </Text>
        </TouchableOpacity>
      </View>
      <ShiftGuardModal />
    </SafeAreaView>
  );
}
