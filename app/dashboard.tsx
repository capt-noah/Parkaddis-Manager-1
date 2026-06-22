import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Car,
  ArrowRight,
  Clock,
  CreditCard,
  CheckCircle2,
  QrCode,
  ChevronRight,
  ShieldCheck as BadgeIcon,
  UserPlus,
} from "lucide-react-native";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";
import BottomSheet from "../components/BottomSheet";
import { DashboardShimmer } from "../components/DashboardShimmer";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../lib/api";
import {
  fetchClerkSessions,
  ClerkSession,
  getSessionTotal,
} from "../lib/clerkSessions";
import { useClerkShiftGuard } from "../hooks/useClerkShiftGuard";
import Loader from '../components/Loader';

const extractReservation = (result: any) => {
  if (!result) return null;
  if (result.id && (result.status || result.qrToken)) return result;
  if (result.reservation) return result.reservation;
  if (result.data?.reservation) return result.data.reservation;
  return result.data || result;
};

export default function Dashboard() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { user, isLoading: authLoading, refreshProfile } = useAuth();
  const { guardAction, ShiftGuardModal } = useClerkShiftGuard();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<ClerkSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeSessions, setActiveSessions] = useState<ClerkSession[]>([]);
  const [stats, setStats] = useState({ revenue: "0", slots: 0 });
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isWalkinOpen, setIsWalkinOpen] = useState(false);
  const [walkinName, setWalkinName] = useState("");
  const [walkinPhone, setWalkinPhone] = useState("");
  const [walkinPlate, setWalkinPlate] = useState("");
  const [walkinModel, setWalkinModel] = useState("");
  const [walkinColor, setWalkinColor] = useState("");
  const [walkinError, setWalkinError] = useState<string | null>(null);
  const [walkinLoading, setWalkinLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const result = await fetchClerkSessions();

      if (result.ok && result.data) {
        const sessions = result.data.reservations;
        const locationStats = result.data.locationStats;
        const totalSlots = locationStats?.totalSlots || 50;

        // Live feed shows ACTIVE (parked), COMPLETED (awaiting payment), RESERVED (upcoming)
        const active = sessions.filter(
          (s) => s.status === "ACTIVE" || s.status === "RESERVED" || s.status === "COMPLETED",
        );
        setActiveSessions(active);

        const totalRevenue = sessions
          .filter((s) => s.status === "PAID")
          .reduce((acc, s) => acc + parseFloat(s.accrued || "0"), 0);

        setStats({
          revenue: totalRevenue.toFixed(0),
          slots: locationStats?.availableSlots ?? Math.max(0, totalSlots - active.length),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchData();
    }
  }, [authLoading]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };



  const resetWalkinForm = () => {
    setWalkinName("");
    setWalkinPhone("");
    setWalkinPlate("");
    setWalkinModel("");
    setWalkinColor("");
    setWalkinError(null);
  };

;

  const handleRegisterWalkin = async () => {
    if (!walkinName || !walkinPhone || !walkinPlate) {
      setWalkinError("Name, phone, and plate number are required.");
      return;
    }

    setWalkinError(null);
    setWalkinLoading(true);

    const registerResult = await apiFetch<any>("/clerk/register-walkin", {
      method: "POST",
      body: JSON.stringify({
        fullName: walkinName,
        phoneNumber: walkinPhone,
        plateNumber: walkinPlate,
        carModel: walkinModel,
        color: walkinColor,
      }),
    });

    if (!registerResult.ok) {
      setWalkinLoading(false);
      setIsWalkinOpen(false);
      const err = registerResult.error || "Failed to register walk-in.";
      resetWalkinForm();
      router.push({
        pathname: "/walkin-fail",
        params: { message: encodeURIComponent(err) },
      });
      return;
    }

    const userId = registerResult.data?.user?.id;
    if (!userId) {
      setWalkinLoading(false);
      setIsWalkinOpen(false);
      resetWalkinForm();
      router.push({
        pathname: "/walkin-fail",
        params: {
          message: encodeURIComponent(
            "Registration succeeded but no user ID returned.",
          ),
        },
      });
      return;
    }

    const reservationResult = await apiFetch<any>("/clerk/create-reservation", {
      method: "POST",
      body: JSON.stringify({
        userId,
        vehicleId: walkinPlate,
      }),
    });

    setWalkinLoading(false);

    if (reservationResult.ok && reservationResult.data) {
      const reservation = extractReservation(reservationResult.data);
      if (reservation?.id) {
        const savedName = walkinName;
        const savedPlate = walkinPlate;
        setIsWalkinOpen(false);
        resetWalkinForm();
        await fetchData();
        router.push({
          pathname: "/walkin-success",
          params: {
            fullName: savedName,
            plateNumber: savedPlate,
            reservationId: reservation.id,
          },
        });
        return;
      }
    }

    setIsWalkinOpen(false);
    const err =
      reservationResult.error || "Failed to create walk-in reservation.";
    resetWalkinForm();
    router.push({
      pathname: "/walkin-fail",
      params: { message: encodeURIComponent(err) },
    });
  };

  const handleCheckout = async () => {
    if (!selectedSession) return;
    setIsCheckingOut(true);
    setCheckoutError(null);
    const result = await apiFetch<any>("/reservation/complete", {
      method: "POST",
      body: JSON.stringify({ reservationId: selectedSession.id }),
    });
    setIsCheckingOut(false);
    if (result.ok && result.data) {
      setIsCheckoutOpen(false);
      await fetchData();
      const reservation = result.data.data || result.data.reservation || result.data;
      router.push({
        pathname: "/checkout-success",
        params: {
          reservationId: selectedSession.id,
          reservationData: JSON.stringify(reservation),
        },
      });
    } else {
      setCheckoutError(result.error || "Checkout failed. Please try again.");
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-slate-900"
      edges={["top"]}
    >
      <TopBar />

      {isLoading || refreshing ? (
        <DashboardShimmer />
      ) : (
        <ScrollView
          className="flex-1 px-6 w-full"
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#064e3b"
            />
          }
        >
          <View className="mb-8">
            {/* Welcome Text */}
            <View className="mb-6 mt-4">
              <Text className="text-3xl font-headline font-bold text-slate-900 dark:text-white">
                Welcome Back,
              </Text>
              <Text className="text-slate-500 dark:text-slate-400 font-medium">
                {user?.fullName || user?.name || "Clerk"}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => guardAction(() => router.push("/scanner"))}
              className="mb-4 bg-primary dark:bg-primary rounded-[28px] px-6 py-8 shadow-lg shadow-primary/25 flex-row items-center justify-between min-h-[120px]"
            >
              <View className="flex-1 pr-4">
                <Text className="text-sm uppercase tracking-[0.3em] text-emerald-100/90 font-bold mb-2">
                  Quick Check-in
                </Text>
                <Text className="text-2xl font-headline font-extrabold text-white">
                  Scan a vehicle now
                </Text>
              </View>
              <View className="w-20 h-20 rounded-3xl bg-white/15 items-center justify-center">
                <QrCode size={32} color="white" />
              </View>
            </TouchableOpacity>

            <View className="mb-6">
              <TouchableOpacity
                onPress={() => guardAction(() => setIsWalkinOpen(true))}
                className="w-full bg-primary dark:bg-emerald-800 rounded-[24px] px-4 py-4 flex-row items-center justify-center gap-2 shadow-md"
              >
                <UserPlus size={20} color="white" />
                <Text className="text-white font-bold text-sm">Register Walk-in</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Live Feed */}
          <View className="flex-row justify-between items-end mb-4">
            <View>
              <Text className="text-xl font-headline font-bold text-slate-900 dark:text-white">
                Live Feed
              </Text>
              <Text className="text-xs text-slate-500 dark:text-slate-400">
                Active & awaiting payment
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/sessions")}
              className="flex-row items-center bg-primary/5 dark:bg-primary/10 px-3 py-1.5 rounded-xl"
            >
              <Text className="text-primary dark:text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
                View All
              </Text>
              <ArrowRight size={12} color="#064e3b" className="ml-1" />
            </TouchableOpacity>
          </View>

          <View className="gap-3">
            {activeSessions.length === 0 ? (
              <View className="bg-white dark:bg-slate-800 rounded-[28px] p-8 items-center border border-slate-100 dark:border-slate-700">
                <Text className="text-slate-400 dark:text-slate-500 font-bold text-sm text-center">No active sessions</Text>
                <Text className="text-slate-300 dark:text-slate-600 text-xs text-center mt-1">Pull down to refresh</Text>
              </View>
            ) : (
              activeSessions.map((session) => {
                const isCompleted = session.status === "COMPLETED";
                const isActive = session.status === "ACTIVE";
                const isPaid = session.status === "PAID";
                const dotColor = isPaid ? "#10b981" : isCompleted ? "#f59e0b" : isActive ? "#059669" : "#3b82f6";
                const statusLabel = isPaid
                  ? "PAID — Open Gate ✓"
                  : isCompleted
                  ? "AWAITING PAYMENT"
                  : isActive
                  ? "ACTIVE — Parked"
                  : session.status;
                const cardBorder = isPaid
                  ? "border-emerald-200 dark:border-emerald-500/30"
                  : isCompleted
                  ? "border-amber-200 dark:border-amber-500/30"
                  : "border-slate-100 dark:border-slate-700";
                const iconBg = isPaid
                  ? "bg-emerald-50 dark:bg-emerald-500/10"
                  : isCompleted
                  ? "bg-amber-50 dark:bg-amber-500/10"
                  : isActive
                  ? "bg-emerald-50 dark:bg-emerald-500/10"
                  : "bg-blue-50 dark:bg-blue-500/10";

                return (
                  <TouchableOpacity
                    key={session.id}
                    className={`bg-white dark:bg-slate-800 p-5 rounded-[28px] border flex-row items-center justify-between ${cardBorder}`}
                    onPress={() => {
                      if (isActive) {
                        setSelectedSession(session);
                        setIsCheckoutOpen(true);
                      }
                    }}
                    activeOpacity={isActive ? 0.7 : 1}
                  >
                    <View className="flex-row items-center gap-4 flex-1">
                      <View className={`w-12 h-12 rounded-2xl items-center justify-center ${iconBg}`}>
                        <BadgeIcon size={24} color={dotColor} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-slate-900 dark:text-white font-headline font-bold text-base">
                          {session.plateNumber}
                        </Text>
                        <View className="flex-row items-center gap-1.5 mt-0.5">
                          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: dotColor }} />
                          <Text
                            className="text-[10px] font-bold uppercase tracking-wider"
                            style={{ color: dotColor }}
                          >
                            {statusLabel}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View className="items-end">
                      <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ETB</Text>
                      <Text className="text-lg font-headline font-bold text-slate-900 dark:text-white">
                        {getSessionTotal(session)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </ScrollView>
      )}



      <BottomSheet
        isOpen={isWalkinOpen}
        onClose={() => {
          setIsWalkinOpen(false);
          resetWalkinForm();
        }}
        title="Register Walk-in"
        subtitle="Add a guest who arrived without a reservation"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          className="w-full"
          contentContainerStyle={{ gap: 12, paddingBottom: 8 }}
        >
          <TextInput
            placeholder="Owner name"
            placeholderTextColor={isDark ? "#475569" : "#94a3b8"}
            value={walkinName}
            onChangeText={setWalkinName}
            className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl py-4 px-4 text-slate-900 dark:text-white"
          />
          <TextInput
            placeholder="Phone number"
            placeholderTextColor={isDark ? "#475569" : "#94a3b8"}
            value={walkinPhone}
            onChangeText={setWalkinPhone}
            keyboardType="phone-pad"
            className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl py-4 px-4 text-slate-900 dark:text-white"
          />
          <TextInput
            placeholder="Plate number"
            placeholderTextColor={isDark ? "#475569" : "#94a3b8"}
            value={walkinPlate}
            onChangeText={setWalkinPlate}
            className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl py-4 px-4 text-slate-900 dark:text-white"
          />
          <TextInput
            placeholder="Vehicle model (optional)"
            placeholderTextColor={isDark ? "#475569" : "#94a3b8"}
            value={walkinModel}
            onChangeText={setWalkinModel}
            className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl py-4 px-4 text-slate-900 dark:text-white"
          />
          <TextInput
            placeholder="Vehicle color (optional)"
            placeholderTextColor={isDark ? "#475569" : "#94a3b8"}
            value={walkinColor}
            onChangeText={setWalkinColor}
            className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl py-4 px-4 text-slate-900 dark:text-white"
          />
          {walkinError ? (
            <Text className="text-red-600 dark:text-red-400 text-sm">
              {walkinError}
            </Text>
          ) : null}
          <TouchableOpacity
            onPress={handleRegisterWalkin}
            disabled={walkinLoading}
            className={`w-full py-4 rounded-2xl items-center justify-center ${
              walkinLoading
                ? "bg-slate-200 dark:bg-slate-700"
                : "bg-primary dark:bg-emerald-800"
            }`}
          >
            {walkinLoading ? (
              <Loader size="sm" color="bg-white" />
            ) : (
              <Text className="text-white font-bold">Register Walk-in</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </BottomSheet>

      {/* Checkout Bottom Sheet */}
      <BottomSheet
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        title="Vehicle Check-out"
        subtitle="Confirm final payment and exit"
      >
        {selectedSession && (
          <View className="gap-6 mt-4 w-full">
            <View className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 w-full shadow-sm">
              <View className="flex-row items-center gap-4 mb-6">
                <View className="w-14 h-14 bg-white dark:bg-slate-700 rounded-2xl items-center justify-center shadow-sm">
                  <Car size={32} color="#064e3b" />
                </View>
                <View>
                  <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Plate Number
                  </Text>
                  <Text className="text-2xl font-headline font-bold text-slate-900 dark:text-white">
                    {selectedSession.plateNumber}
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-4 w-full">
                <View className="bg-white dark:bg-slate-700 p-4 rounded-2xl border border-slate-100 dark:border-slate-600 flex-1">
                  <View className="flex-row items-center gap-1 mb-1">
                    <Clock size={14} color="#94a3b8" />
                    <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      Duration
                    </Text>
                  </View>
                  <Text className="text-lg font-bold text-slate-900 dark:text-white">
                    {selectedSession.duration || "0h"}
                  </Text>
                </View>
                <View className="bg-white dark:bg-slate-700 p-4 rounded-2xl border border-slate-100 dark:border-slate-600 flex-1">
                  <View className="flex-row items-center gap-1 mb-1">
                    <CreditCard size={14} color="#94a3b8" />
                    <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      Rate
                    </Text>
                  </View>
                  <Text className="text-lg font-bold text-slate-900 dark:text-white">
                    40 ETB/hr
                  </Text>
                </View>
              </View>

              <View className="mt-6 pt-6 w-full border-t border-dashed border-slate-200 dark:border-slate-600">
                <View className="flex-row justify-between items-center w-full">
                  <Text className="text-slate-500 dark:text-slate-400 font-medium">
                    Total Fee
                  </Text>
                  <Text className="text-3xl font-headline font-extrabold text-primary dark:text-emerald-500">
                    ETB {getSessionTotal(selectedSession)}
                  </Text>
                </View>
              </View>
            </View>

            <View className="gap-3 w-full">
              {checkoutError && (
                <View className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-900/30">
                  <Text className="text-red-600 dark:text-red-400 text-xs font-bold text-center">
                    {checkoutError}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                onPress={handleCheckout}
                disabled={isCheckingOut}
                className={`w-full py-5 rounded-2xl items-center justify-center flex-row gap-2 shadow-lg shadow-primary/20 ${
                  isCheckingOut
                    ? "bg-primary/60"
                    : "bg-primary dark:bg-emerald-800 active:opacity-80"
                }`}
              >
                <CheckCircle2 size={24} color="white" />
                <Text className="text-white font-headline font-bold uppercase tracking-widest">
                  {isCheckingOut ? <Loader size="sm" color="bg-white" /> : "Confirm Checkout"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsCheckoutOpen(false);
                  setCheckoutError(null);
                }}
                className="w-full bg-slate-100 dark:bg-slate-700 py-4 rounded-2xl items-center justify-center active:bg-slate-200 dark:active:bg-slate-600"
              >
                <Text className="text-slate-600 dark:text-slate-300 font-headline font-bold uppercase tracking-widest">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </BottomSheet>

      <ShiftGuardModal />
      <BottomNav />
    </SafeAreaView>
  );
}
