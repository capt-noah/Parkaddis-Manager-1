import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter } from "expo-router";
import { AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react-native";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { apiFetch } from "../lib/api";
import Loader from '../components/Loader';
import {
  searchClerkUser,
  verifyClerkPayment,
  getSearchErrorMessage,
  isPaymentCleared,
  PaymentVerificationResult,
} from "../lib/clerkGate";

interface SearchResult {
  user: any;
  reservation: any | null;
}

export default function ManualReservation() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [qrToken, setQrToken] = useState("");
  const [searchMode, setSearchMode] = useState<"phone" | "email">("phone");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchPaymentResults, setSearchPaymentResults] = useState<
    Record<string, PaymentVerificationResult>
  >({});
  const [verifyingReservationId, setVerifyingReservationId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const extractReservation = (result: any) => {
    if (!result) return null;

    // If this object already looks like a reservation, return it
    if (
      result.id &&
      (result.status || result.actualStartTime || result.actualEndTime)
    )
      return result;

    // Common wrapper shapes
    if (result.reservation) return result.reservation;
    if (result.reservedSpot) return result.reservedSpot;

    // Some backends wrap payload in `data`
    if (result.data) {
      const inner = result.data;
      if (inner.reservation) return inner.reservation;
      if (inner.reservedSpot) return inner.reservedSpot;
      if (
        inner.id &&
        (inner.status || inner.actualStartTime || inner.actualEndTime)
      )
        return inner;
      // If data is an array, pick active/reserved
      if (Array.isArray(inner)) {
        return (
          inner.find(
            (r: any) => r.status === "ACTIVE" || r.status === "RESERVED",
          ) ||
          inner[0] ||
          null
        );
      }
    }

    // If object contains list of reservations
    if (Array.isArray(result.reservations)) {
      return (
        result.reservations.find(
          (r: any) => r.status === "ACTIVE" || r.status === "RESERVED",
        ) ||
        result.reservations[0] ||
        null
      );
    }

    // As a last resort, search one level deep for an object that looks like a reservation
    for (const key of Object.keys(result)) {
      const candidate = result[key];
      if (candidate && typeof candidate === "object" && candidate.id)
        return candidate;
    }

    return null;
  };

  const handleValidateToken = async (token?: string) => {
    const finalToken = (token || qrToken).trim();
    if (!finalToken) {
      setValidationError("Enter a QR token to validate.");
      return;
    }

    setValidationError(null);
    setIsLoading(true);

    const result = await apiFetch<any>("/reservation/validate", {
      method: "POST",
      body: JSON.stringify({ qrToken: finalToken }),
    });

    setIsLoading(false);

    if (result.ok && result.data) {
      const reservation = extractReservation(result.data);
      if (reservation?.status === "COMPLETED") {
        router.push({
          pathname: "/checkout-success",
          params: { reservationId: reservation.id, reservationData: JSON.stringify(reservation) },
        });
      } else if (reservation?.id) {
        router.push({
          pathname: "/success",
          params: { reservationId: reservation.id, reservationData: JSON.stringify(reservation) },
        });
      } else {
        router.push(
          `/scan-fail?message=${encodeURIComponent("QR validation succeeded but reservation data is unavailable.")}`,
        );
      }
    } else {
      router.push(
        `/scan-fail?message=${encodeURIComponent(result.error || "Failed to validate QR token.")}`,
      );
    }
  };

  const handleSearchUser = async () => {
    const query = searchQuery.trim();
    if (!query) {
      setSearchError(
        searchMode === "phone"
          ? "Enter a phone number to search."
          : "Enter an email address to search.",
      );
      return;
    }

    setSearchError(null);
    setIsSearching(true);

    const result = await searchClerkUser(
      searchMode === "phone"
        ? { phoneNumber: query }
        : { email: query },
    );
    setIsSearching(false);

    if (result.ok && result.data) {
      const { user, activeReservation, locationMismatch } = result.data;

      if (!user?.id) {
        setSearchResults([]);
        setSearchError("No user found.");
        return;
      }

      const reservation = activeReservation || null;
      setSearchResults([{ user, reservation }]);

      if (locationMismatch) {
        setSearchError(
          "User found, but their active reservation belongs to another parking location.",
        );
      } else if (!reservation) {
        setSearchError("User found but no active reservation at your location.");
      }
    } else {
      setSearchResults([]);
      setSearchError(getSearchErrorMessage(result));
    }
  };

  const handleSearchVerifyPayment = async (reservation: {
    id: string;
    qrToken?: string;
  }) => {
    setVerifyingReservationId(reservation.id);
    setSearchError(null);

    const result = await verifyClerkPayment({
      reservationId: reservation.id,
      ...(reservation.qrToken ? { qrToken: reservation.qrToken } : {}),
    });

    setVerifyingReservationId(null);

    if (result.ok && result.data) {
      setSearchPaymentResults((prev) => ({
        ...prev,
        [reservation.id]: result.data!,
      }));
    } else {
      setSearchError(
        result.error || "Payment verification failed. Please try again.",
      );
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-slate-900"
      edges={["top"]}
    >
      <TopBar />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 8,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-6 mt-4">
            <Text className="text-2xl font-headline font-bold tracking-tight text-primary dark:text-emerald-500">
              Manual Session Control
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 font-medium mt-1">
              Search for a user or validate a QR token manually.
            </Text>
          </View>

          <View className="bg-white dark:bg-slate-800 rounded-[32px] p-6 mb-6 border border-slate-100 dark:border-slate-700 shadow-sm">
            <Text className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-4">
              Validate reservation
            </Text>

            <View className="mb-4">
              <Text className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                QR token
              </Text>
              <TextInput
                placeholder="Enter scanned QR token"
                placeholderTextColor={isDark ? "#475569" : "#94a3b8"}
                value={qrToken}
                onChangeText={setQrToken}
                className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl py-4 px-4 text-slate-900 dark:text-white"
              />
            </View>

            <TouchableOpacity
              onPress={() => handleValidateToken()}
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl items-center justify-center mb-4 ${isLoading ? "bg-slate-200 dark:bg-slate-700" : "bg-primary dark:bg-emerald-800"}`}
            >
              {isLoading ? <Loader size="sm" color="bg-white" /> : <Text className="text-white font-bold">Validate QR Token</Text>}
            </TouchableOpacity>

            <View className="border-t border-slate-200 dark:border-slate-700 pt-6">
              <Text className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                Search user
              </Text>
              <View className="flex-row gap-2 mb-3">
                {(["phone", "email"] as const).map((mode) => {
                  const selected = searchMode === mode;
                  return (
                    <TouchableOpacity
                      key={mode}
                      onPress={() => setSearchMode(mode)}
                      className={`px-4 py-2 rounded-full border ${
                        selected
                          ? "bg-primary dark:bg-emerald-800 border-transparent"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      <Text
                        className={`text-[10px] font-bold uppercase tracking-widest ${
                          selected ? "text-white" : "text-slate-400"
                        }`}
                      >
                        {mode}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View className="flex-row gap-3">
                <TextInput
                  placeholder={
                    searchMode === "phone"
                      ? "0911223344 or +251911223344"
                      : "user@example.com"
                  }
                  placeholderTextColor={isDark ? "#475569" : "#94a3b8"}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  keyboardType={searchMode === "phone" ? "phone-pad" : "email-address"}
                  autoCapitalize="none"
                  className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-2xl py-4 px-4 text-slate-900 dark:text-white"
                />
                <TouchableOpacity
                  onPress={handleSearchUser}
                  disabled={isSearching}
                  className={`px-5 py-4 rounded-2xl items-center justify-center ${isSearching ? "bg-slate-200 dark:bg-slate-700" : "bg-primary dark:bg-emerald-800"}`}
                >
                  {isSearching ? <Loader size="sm" color="bg-white" /> : <Text className="text-white font-bold">Search</Text>}
                </TouchableOpacity>
              </View>
              {searchError ? (
                <Text className="text-red-600 dark:text-red-400 text-sm mt-3">
                  {searchError}
                </Text>
              ) : null}
            </View>

            {searchResults.length > 0 ? (
              <View className="mt-6 space-y-4">
                {searchResults.map((result, index) => {
                  const reservation = result.reservation;
                  const phone =
                    result.user?.phoneNumber ||
                    result.user?.phone ||
                    "Unknown phone";
                  const name =
                    result.user?.fullName ||
                    result.user?.name ||
                    "Unknown user";
                  const vehiclePlate =
                    reservation?.plateNumber ||
                    reservation?.vehicle?.plateNumber ||
                    "Unknown vehicle";
                  const status = reservation?.status || "No active reservation";
                  const token =
                    reservation?.qrToken || reservation?.token || "";

                  return (
                    <View
                      key={`${result.user?.id || index}-${token}-${status}`}
                      className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-700"
                    >
                      <View className="flex-row justify-between items-start mb-3">
                        <View>
                          <Text className="font-bold text-slate-900 dark:text-white">
                            {name}
                          </Text>
                          <Text className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">
                            {phone}
                          </Text>
                        </View>
                        <View className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                          <Text className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {status}
                          </Text>
                        </View>
                      </View>

                      <Text className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        Vehicle: {vehiclePlate}
                      </Text>

                      {reservation ? (
                        <View className="gap-3">
                          {reservation.status === "RESERVED" && token ? (
                            <TouchableOpacity
                              onPress={() => handleValidateToken(token)}
                              disabled={isLoading || actionLoading === reservation.id}
                              className={`w-full py-4 rounded-2xl items-center justify-center ${isLoading || actionLoading === reservation.id ? "bg-slate-200 dark:bg-slate-700" : "bg-primary dark:bg-emerald-800"}`}
                            >
                              {actionLoading === reservation.id ? (
                                <Loader size="sm" color="bg-white" />
                              ) : (
                                <Text className="text-white font-bold">
                                  Validate Token
                                </Text>
                              )}
                            </TouchableOpacity>
                          ) : null}

                          {reservation.status === "ACTIVE" && token ? (
                            <TouchableOpacity
                              onPress={() => {
                                setActionLoading(reservation.id);
                                handleValidateToken(token).finally(() =>
                                  setActionLoading(null),
                                );
                              }}
                              disabled={isLoading || actionLoading === reservation.id}
                              className={`w-full py-4 rounded-2xl items-center justify-center ${isLoading || actionLoading === reservation.id ? "bg-slate-200 dark:bg-slate-700" : "bg-primary dark:bg-emerald-800"}`}
                            >
                              {actionLoading === reservation.id ? (
                                <Loader size="sm" color="bg-white" />
                              ) : (
                                <Text className="text-white font-bold">
                                  Complete Session
                                </Text>
                              )}
                            </TouchableOpacity>
                          ) : null}

                          {reservation.status === "COMPLETED" ? (
                            <TouchableOpacity
                              onPress={() => handleSearchVerifyPayment(reservation)}
                              disabled={verifyingReservationId === reservation.id}
                              className={`w-full py-4 rounded-2xl items-center justify-center ${
                                verifyingReservationId === reservation.id
                                  ? "bg-slate-200 dark:bg-slate-700"
                                  : "bg-emerald-500 dark:bg-emerald-600"
                              }`}
                            >
                              <Text className="text-white font-bold">
                                Verify Payment
                              </Text>
                            </TouchableOpacity>
                          ) : null}

                          {searchPaymentResults[reservation.id] ? (
                            <View
                              className={`rounded-2xl p-4 border ${
                                isPaymentCleared(
                                  searchPaymentResults[reservation.id].paymentStatus,
                                )
                                  ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
                                  : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                              }`}
                            >
                              <View className="flex-row items-center gap-2 mb-2">
                                {isPaymentCleared(
                                  searchPaymentResults[reservation.id].paymentStatus,
                                ) ? (
                                  <CheckCircle2 size={20} color="#059669" />
                                ) : (
                                  <ShieldAlert size={20} color="#dc2626" />
                                )}
                                <Text
                                  className={`flex-1 text-sm font-bold ${
                                    isPaymentCleared(
                                      searchPaymentResults[reservation.id].paymentStatus,
                                    )
                                      ? "text-emerald-700 dark:text-emerald-400"
                                      : "text-red-700 dark:text-red-400"
                                  }`}
                                >
                                  {isPaymentCleared(
                                    searchPaymentResults[reservation.id].paymentStatus,
                                  )
                                    ? "Payment Cleared - Open Gate"
                                    : "Not Paid - Do Not Open Gate"}
                                </Text>
                              </View>
                              <Text className="text-xs text-slate-600 dark:text-slate-300">
                                ETB {searchPaymentResults[reservation.id].amount}
                              </Text>
                            </View>
                          ) : null}

                          {!token &&
                          (reservation.status === "RESERVED" ||
                            reservation.status === "ACTIVE") ? (
                            <Text className="text-sm text-amber-600 dark:text-amber-400">
                              No QR token available for this reservation.
                            </Text>
                          ) : null}
                        </View>
                      ) : (
                        <Text className="text-sm text-slate-500 dark:text-slate-400">
                          No active reservation found for this user.
                        </Text>
                      )}
                    </View>
                  );
                })}
              </View>
            ) : null}

            {validationError ? (
              <Text className="text-red-600 dark:text-red-400 text-sm mt-4">
                {validationError}
              </Text>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomNav />
    </SafeAreaView>
  );
}
