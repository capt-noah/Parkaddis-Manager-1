import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowRight, CheckCircle2, ShieldAlert, Car, MapPin, DollarSign } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { normalizeReservation } from "../lib/reservationDisplay";
import {
  verifyClerkPayment,
  isPaymentCleared,
  PaymentVerificationResult,
} from "../lib/clerkGate";
import { useTheme } from "../context/ThemeContext";
import Loader from '../components/Loader';

export default function CheckoutSuccess() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { reservationId, reservationData } = useLocalSearchParams<{
    reservationId: string;
    reservationData?: string;
  }>();

  const [paymentResult, setPaymentResult] =
    React.useState<PaymentVerificationResult | null>(null);
  const [paymentError, setPaymentError] = React.useState<string | null>(null);
  const [isVerifying, setIsVerifying] = React.useState(true);

  let plateNumber = "—";
  let locationName = "Parking Location";
  let resObj: any = null;

  if (reservationData) {
    try {
      resObj = normalizeReservation(JSON.parse(reservationData)) as any;
      if (resObj) {
        plateNumber = resObj.plateNumber || resObj.vehicle?.plateNumber || "—";
        locationName =
          resObj.locationName || resObj.spot?.location?.name || "Parking Location";
      }
    } catch {}
  }

  React.useEffect(() => {
    verifyClerkPayment({
      reservationId: resObj?.id || reservationId,
      ...(resObj?.qrToken ? { qrToken: resObj.qrToken } : {}),
    }).then((result) => {
      setIsVerifying(false);
      if (result.ok && result.data) {
        setPaymentResult(result.data);
      } else {
        setPaymentError(result.error || "Unable to verify payment.");
      }
    });
  }, [reservationId]);

  const gateCleared =
    paymentResult &&
    isPaymentCleared(paymentResult.paymentStatus, paymentResult.status);
  const amount = paymentResult?.amount || resObj?.accrued || null;

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-[#0f172a]" : "bg-[#f8fafc]"}`}
      edges={["top", "bottom"]}
    >
      <View className="flex-1 items-center justify-center px-6 gap-8">
        {/* Icon */}
        {isVerifying ? (
          <Loader size="lg" color="bg-[#064e3b]" />
        ) : (
          <View
            style={{
              shadowColor: gateCleared ? "#10b981" : "#ef4444",
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 12,
            }}
            className={`w-28 h-28 rounded-full items-center justify-center ${
              gateCleared ? "bg-emerald-500" : "bg-red-500"
            }`}
          >
            {gateCleared ? (
              <CheckCircle2 size={56} color="white" />
            ) : (
              <ShieldAlert size={56} color="white" />
            )}
          </View>
        )}

        {/* Headline */}
        {!isVerifying && (
          <View className="items-center gap-2">
            <Text
              className={`text-3xl font-black tracking-tight text-center ${
                isDark ? "text-white" : "text-[#0f172a]"
              }`}
            >
              {gateCleared ? "Session Closed" : "Payment Required"}
            </Text>
            <Text className="text-slate-500 text-base text-center px-4">
              {gateCleared
                ? "Payment cleared. Open the gate."
                : paymentError ||
                  "Do not open the gate until payment is complete."}
            </Text>
          </View>
        )}

        {/* Details card */}
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

          {amount ? (
            <>
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
                  <DollarSign size={22} color={isDark ? "#34d399" : "#064e3b"} />
                </View>
                <View>
                  <Text
                    className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${
                      isDark ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    TOTAL
                  </Text>
                  <Text
                    className={`text-xl font-black ${
                      gateCleared
                        ? "text-emerald-500"
                        : isDark
                        ? "text-white"
                        : "text-[#0f172a]"
                    }`}
                  >
                    ETB {amount}
                  </Text>
                </View>
              </View>
            </>
          ) : null}
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
