import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { XCircle } from "lucide-react-native";
import { useClerkShiftGuard } from "../hooks/useClerkShiftGuard";

export default function ScanFail() {
  const router = useRouter();
  const { guardAction, ShiftGuardModal } = useClerkShiftGuard();
  const params = useLocalSearchParams<{ message?: string }>();
  const message = params.message
    ? decodeURIComponent(params.message)
    : "Unable to validate this QR code.";

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-slate-900"
      edges={["top", "bottom"]}
    >
      <View className="flex-1 px-6 pt-12 items-center justify-center text-center">
        <View className="w-28 h-28 rounded-full bg-red-100 dark:bg-red-900/30 items-center justify-center mb-8">
          <XCircle size={54} color="#dc2626" />
        </View>
        <Text className="text-3xl font-headline font-bold text-slate-900 dark:text-white text-center mb-4">
          Validation Failed
        </Text>
        <Text className="text-sm text-slate-500 dark:text-slate-400 text-center mb-8 px-4">
          {message}
        </Text>

        <TouchableOpacity
          onPress={() => guardAction(() => router.push("/scanner"))}
          className="w-full bg-primary dark:bg-emerald-800 py-4 rounded-2xl items-center justify-center mb-4"
        >
          <Text className="text-white font-bold text-base">Retry Scan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/manual-reservation")}
          className="w-full bg-slate-100 dark:bg-slate-800 py-4 rounded-2xl items-center justify-center mb-4"
        >
          <Text className="text-slate-900 dark:text-white font-bold text-base">
            Resolve Manually
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/dashboard")}
          className="w-full bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 py-4 rounded-2xl items-center justify-center"
        >
          <Text className="text-slate-600 dark:text-slate-400 font-bold text-base">
            Back to Dashboard
          </Text>
        </TouchableOpacity>
      </View>
      <ShiftGuardModal />
    </SafeAreaView>
  );
}
