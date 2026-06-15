import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ShieldAlert, Home, RotateCcw } from "lucide-react-native";

export default function PaymentVerifyFail() {
  const router = useRouter();
  const { message, amount, reservationId, paymentStatus } =
    useLocalSearchParams<{
      message?: string;
      amount?: string;
      reservationId?: string;
      paymentStatus?: string;
    }>();

  const displayMessage = message
    ? decodeURIComponent(message)
    : paymentStatus
      ? `Payment status: ${paymentStatus}. Do not open the gate until payment is complete.`
      : "Payment has not been cleared. Do not allow the vehicle to exit.";

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-slate-900"
      edges={["top", "bottom"]}
    >
      <View className="flex-1 px-6 pt-12 items-center justify-center">
        <View className="w-28 h-28 rounded-full bg-red-100 dark:bg-red-900/30 items-center justify-center mb-8">
          <ShieldAlert size={54} color="#dc2626" />
        </View>
        <Text className="text-3xl font-headline font-bold text-slate-900 dark:text-white text-center mb-3">
          Payment Required
        </Text>
        <Text className="text-lg font-bold text-red-600 dark:text-red-400 text-center mb-2">
          Do Not Open Gate
        </Text>
        <Text className="text-sm text-slate-500 dark:text-slate-400 text-center mb-8 px-4">
          {displayMessage}
        </Text>

        {amount ? (
          <View className="w-full bg-white dark:bg-slate-800 rounded-[28px] p-6 border border-red-100 dark:border-red-900/30 mb-8">
            <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
              Amount Due
            </Text>
            <Text className="text-3xl font-headline font-extrabold text-red-600 dark:text-red-400">
              ETB {amount}
            </Text>
            {reservationId ? (
              <Text className="text-[10px] text-slate-400 mt-3 uppercase tracking-wider">
                Ref: {reservationId.substring(0, 8)}
              </Text>
            ) : null}
          </View>
        ) : null}

        <TouchableOpacity
          onPress={() => router.push("/dashboard")}
          className="w-full bg-primary dark:bg-emerald-800 py-4 rounded-2xl items-center justify-center flex-row gap-2 mb-4"
        >
          <RotateCcw size={20} color="white" />
          <Text className="text-white font-bold text-base">Try Again</Text>
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
    </SafeAreaView>
  );
}
