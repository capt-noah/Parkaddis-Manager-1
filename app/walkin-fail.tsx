import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { XCircle, Home, RotateCcw } from "lucide-react-native";

export default function WalkinFail() {
  const router = useRouter();
  const params = useLocalSearchParams<{ message?: string }>();
  const message = params.message
    ? decodeURIComponent(params.message)
    : "Unable to register the walk-in guest. Please try again.";

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-slate-900"
      edges={["top", "bottom"]}
    >
      <View className="flex-1 px-6 pt-12 items-center justify-center">
        <View className="w-28 h-28 rounded-full bg-red-100 dark:bg-red-900/30 items-center justify-center mb-8">
          <XCircle size={54} color="#dc2626" />
        </View>
        <Text className="text-3xl font-headline font-bold text-slate-900 dark:text-white text-center mb-4">
          Registration Failed
        </Text>
        <Text className="text-sm text-slate-500 dark:text-slate-400 text-center mb-8 px-4">
          {message}
        </Text>

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
