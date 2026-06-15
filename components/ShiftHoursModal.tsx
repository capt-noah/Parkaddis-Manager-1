import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Clock, ShieldAlert, X } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";
import { ClerkGateBlockReason, formatShiftRange } from "../lib/clerkShift";

interface ShiftHoursModalProps {
  visible: boolean;
  onClose: () => void;
  reason?: ClerkGateBlockReason;
  shiftStartTime?: string | null;
  shiftEndTime?: string | null;
  message?: string;
}

export default function ShiftHoursModal({
  visible,
  onClose,
  reason = "shift",
  shiftStartTime,
  shiftEndTime,
  message,
}: ShiftHoursModalProps) {
  const { isDark } = useTheme();
  const isInactive = reason === "inactive";
  const title = isInactive ? "Account Inactive" : "Outside Working Hours";
  const bodyMessage =
    message ??
    (isInactive
      ? "Your clerk account is inactive. Gate actions are disabled until your supervisor reactivates your account."
      : "You are outside your working hours. Gate actions are only available during your assigned shift.");

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-slate-900/60 items-center justify-center px-6">
          <TouchableWithoutFeedback>
            <View className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-[32px] p-8 border border-slate-100 dark:border-slate-700 shadow-2xl">
              <View className="flex-row justify-between items-start mb-6">
                <View
                  className={`w-14 h-14 rounded-2xl items-center justify-center ${
                    isInactive
                      ? "bg-red-50 dark:bg-red-900/20"
                      : "bg-amber-50 dark:bg-amber-900/20"
                  }`}
                >
                  {isInactive ? (
                    <ShieldAlert size={28} color={isDark ? "#f87171" : "#dc2626"} />
                  ) : (
                    <Clock size={28} color={isDark ? "#fbbf24" : "#d97706"} />
                  )}
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full items-center justify-center"
                >
                  <X size={20} color={isDark ? "#94A3B8" : "#475569"} />
                </TouchableOpacity>
              </View>

              <Text className="text-2xl font-headline font-bold text-slate-900 dark:text-white mb-3">
                {title}
              </Text>
              <Text className="text-slate-500 dark:text-slate-400 font-medium leading-6 mb-6">
                {bodyMessage}
              </Text>

              {!isInactive ? (
                <View className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl px-5 py-4 mb-8">
                  <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
                    Your shift
                  </Text>
                  <Text className="text-lg font-headline font-bold text-slate-900 dark:text-white">
                    {formatShiftRange(shiftStartTime, shiftEndTime)}
                  </Text>
                </View>
              ) : (
                <View className="mb-8" />
              )}

              <TouchableOpacity
                onPress={onClose}
                className="w-full bg-primary dark:bg-emerald-800 py-4 rounded-2xl items-center"
              >
                <Text className="text-white font-bold text-base">Got it</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
