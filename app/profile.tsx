import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import Loader from '../components/Loader';
import {
  Clock,
  BarChart3,
  ChevronRight,
  LogOut,
  Download,
  Settings,
  ShieldCheck,
  Lock,
  Smartphone,
  FileText,
} from "lucide-react-native";
import TopBar from "../components/TopBar";
import { ProfileShimmer } from "../components/ProfileShimmer";
import BottomSheet from "../components/BottomSheet";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "../components/BottomNav";
import { useTheme } from "../context/ThemeContext";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { fetchClerkSessions } from "../lib/clerkSessions";
import { formatShiftRange } from "../lib/clerkShift";

import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { user, logout, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    refreshProfile().finally(() => {
      const timer = setTimeout(() => setIsLoading(false), 800);
    });
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshProfile(true); // force=true: always fetch on manual pull-to-refresh
    setRefreshing(false);
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const handleDownloadReport = async (title: string) => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const result = await fetchClerkSessions();
      const sessions = result.ok && result.data ? result.data.reservations : [];

      const csvHeader =
        "ID,Plate Number,Status,Payment Status,Duration,Accrued\n";
      const csvRows = sessions
        .map(
          (s: any) =>
            `${s.id},${s.plateNumber},${s.status},${s.paymentStatus},${s.duration || "0m"},${s.accrued || "0"}`,
        )
        .join("\n");

      const csvContent = csvHeader + csvRows;
      const fileName = `${title.replace(/\s+/g, "_").toLowerCase()}_${new Date().getTime()}.csv`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "text/csv",
          dialogTitle: "Share Report",
        });
      } else {
        alert("Sharing is not available on this device");
      }
    } catch (e) {
      alert("Failed to generate report");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-slate-900"
      edges={["top"]}
    >
      {/* Top Bar - Restore Branding Logo and Simplified Profile settings toggle */}
      <TopBar
        showLogo={true}
        rightElement={
          <TouchableOpacity
            onPress={() => router.push("/settings")}
            className="w-10 h-10 rounded-full items-center justify-center bg-slate-100 dark:bg-slate-800"
          >
            <Settings size={20} color={isDark ? "#94a3b8" : "#475569"} />
          </TouchableOpacity>
        }
        showProfile={false}
      />

      {isLoading ? (
        <ProfileShimmer />
      ) : (
        <ScrollView
          className="flex-1 px-6 w-full"
          contentContainerStyle={{ paddingBottom: 110 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#064e3b"
            />
          }
        >
          {/* Profile Header Section - Restored with Avatar and User Info */}
          <View className="items-center mt-6 mb-10">
            <View className="relative">
                            <View className="w-28 h-28 rounded-[40px] bg-primary items-center justify-center border-4 border-white dark:border-slate-800 shadow-xl shadow-slate-200 dark:shadow-black/50">
                <Text className="text-4xl font-headline font-extrabold text-white" style={{ letterSpacing: -1 }}>
                  {(user?.fullName || "?").charAt(0).toUpperCase()}
                </Text>
              </View>
              <View className="absolute -bottom-2 -right-2 bg-primary w-8 h-8 rounded-2xl border-4 border-white dark:border-slate-800 items-center justify-center">
                <View className="w-2 h-2 bg-white rounded-full" />
              </View>
            </View>

            <View className="items-center mt-4">
              <Text className="text-2xl font-headline font-bold text-slate-900 dark:text-white">
                {user?.fullName || "Clerk"}
              </Text>
              <Text className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest">
                {user?.role === "admin" ? "Clerk Supervisor" : "Clerk"}
              </Text>
              <Text className="text-[10px] text-slate-400 mt-1 font-bold">
                {user?.email}
              </Text>
            </View>
          </View>

          {/* List Sections */}
          <View className="gap-8 w-full">
            <View>
              <Text className="text-[10px] font-headline font-extrabold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4 px-2">
                Shift History
              </Text>
              <View className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
                <TouchableOpacity className="flex-row items-center justify-between p-5 active:bg-slate-50 dark:active:bg-slate-700">
                  <View className="flex-row items-center gap-4">
                    <View className="w-10 h-10 rounded-2xl bg-primary/5 dark:bg-primary/10 items-center justify-center">
                      <Clock size={20} color={isDark ? "#10b981" : "#064e3b"} />
                    </View>
                    <View>
                      <Text className="text-sm font-bold text-slate-900 dark:text-white">
                        {user?.locationName || "Current Shift"}
                      </Text>
                      <Text className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wide">
                        {user?.shiftStartTime && user?.shiftEndTime 
                          ? `Today • ${formatShiftRange(user.shiftStartTime, user.shiftEndTime)}` 
                          : 'No shift assigned'}
                      </Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color="#94a3b8" />
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text className="text-[10px] font-headline font-extrabold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4 px-2">
                Station Reports
              </Text>
              <View className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
                <TouchableOpacity
                  onPress={() => setIsReportsOpen(true)}
                  className="flex-row items-center justify-between p-5 active:bg-slate-50 dark:active:bg-slate-700"
                >
                  <View className="flex-row items-center gap-4">
                    <View className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-900/20 items-center justify-center">
                      <BarChart3 size={20} color="#d97706" />
                    </View>
                    <View>
                      <Text className="text-sm font-bold text-slate-900 dark:text-white">
                        Daily Occupancy Summary
                      </Text>
                      <Text className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wide">
                        PDF Report • 2.4 MB
                      </Text>
                    </View>
                  </View>
                  <Download size={20} color="#94a3b8" />
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text className="text-[10px] font-headline font-extrabold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4 px-2">
                Settings
              </Text>
              <View className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
                <TouchableOpacity
                  onPress={() => setIsSecurityOpen(true)}
                  className="flex-row items-center justify-between p-5 active:bg-slate-50 dark:active:bg-slate-700"
                >
                  <View className="flex-row items-center gap-4">
                    <View className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-700 items-center justify-center">
                      <ShieldCheck size={20} color="#475569" />
                    </View>
                    <View>
                      <Text className="text-sm font-bold text-slate-900 dark:text-white">
                        Account Security
                      </Text>
                      <Text className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wide">
                        2FA Enabled • Password Changed
                      </Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color="#94a3b8" />
                </TouchableOpacity>
                <View className="h-[1px] bg-slate-100 dark:bg-slate-700 mx-5" />
                <TouchableOpacity
                  onPress={handleLogout}
                  className="flex-row items-center justify-between p-5 active:bg-red-50 dark:active:bg-red-900/10"
                >
                  <View className="flex-row items-center gap-4">
                    <View className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-900/20 items-center justify-center">
                      <LogOut size={20} color="#dc2626" />
                    </View>
                    <View>
                      <Text className="text-sm font-bold text-red-600">
                        Logout
                      </Text>
                      <Text className="text-[10px] text-red-600/60 dark:text-red-400/60 font-medium uppercase tracking-wide">
                        Securely end your session
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      {/* Station Reports Bottom Sheet */}
      <BottomSheet
        isOpen={isReportsOpen}
        onClose={() => setIsReportsOpen(false)}
        title="Station Reports"
        subtitle="Access and audit station metrics"
      >
        <View className="gap-4 w-full mt-4">
          {[
            {
              title: "Daily Occupancy Summary",
              size: "Generated Live",
              type: "CSV",
              icon: BarChart3,
            },
            {
              title: "Staff Performance Audit",
              size: "Generated Live",
              type: "CSV",
              icon: FileText,
            },
          ].map((report, i) => (
            <View
              key={i}
              className="bg-slate-50 dark:bg-slate-700 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-600"
            >
              <View className="p-5 flex-row gap-4 items-center">
                <View className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <report.icon
                    size={24}
                    color={isDark ? "#10b981" : "#064e3b"}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-slate-900 dark:text-white">
                    {report.title}
                  </Text>
                  <View className="flex-row items-center gap-3 mt-1">
                    <Text className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {report.size}
                    </Text>
                    <View className="w-1 h-1 bg-slate-200 dark:bg-slate-600 rounded-full" />
                    <Text className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {report.type}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="p-4 flex-row gap-3">
                <TouchableOpacity
                  onPress={() => handleDownloadReport(report.title)}
                  disabled={isDownloading}
                  className="flex-1 flex-row items-center justify-center gap-2 py-2.5 px-4 bg-primary rounded-lg active:opacity-80"
                >
                  {isDownloading ? (
                    <Loader size="sm" color="bg-white" />
                  ) : (
                    <>
                      <Download size={16} color="white" />
                      <Text className="text-white text-xs font-bold">
                        Download {report.type}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 py-2.5 px-4 bg-white dark:bg-slate-800 rounded-lg border border-primary/10 dark:border-slate-700 active:opacity-80">
                  <FileText size={16} color={isDark ? "#10b981" : "#064e3b"} />
                  <Text className="text-primary dark:text-emerald-500 text-xs font-bold">
                    View Report
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </BottomSheet>

      {/* Account Security Bottom Sheet */}
      <BottomSheet
        isOpen={isSecurityOpen}
        onClose={() => setIsSecurityOpen(false)}
        title="Account Security"
        subtitle="Security & Access"
      >
        <View className="gap-6 mt-4 w-full">
          <View className="bg-slate-50 dark:bg-slate-700 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-600">
            <TouchableOpacity className="p-6 flex-row items-center justify-between active:bg-white dark:active:bg-slate-600">
              <View className="flex-row items-center gap-5">
                <View className="h-12 w-12 rounded-xl bg-primary/10 items-center justify-center">
                  <Lock size={24} color={isDark ? "#10b981" : "#064e3b"} />
                </View>
                <View>
                  <Text className="font-bold text-slate-900 dark:text-white">
                    Update Password
                  </Text>
                  <Text className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Last changed 3 months ago
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          <View className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-5">
                <View className="h-12 w-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 items-center justify-center">
                  <Smartphone size={24} color="#d97706" />
                </View>
                <View>
                  <Text className="font-bold text-slate-900 dark:text-white">
                    Two-Factor Auth
                  </Text>
                  <Text className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Add an extra layer of security
                  </Text>
                </View>
              </View>
              <Switch
                trackColor={{ true: "#064e3b", false: "#e2e8f0" }}
                value={true}
              />
            </View>
          </View>

          <View className="pt-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Recent Login History
              </Text>
              <TouchableOpacity>
                <Text className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            <View className="gap-3">
              <View className="flex-row items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-100 dark:border-slate-600">
                <View className="flex-row items-center gap-3">
                  <Smartphone
                    size={20}
                    color={isDark ? "#10b981" : "#064e3b"}
                  />
                  <View>
                    <Text className="text-sm font-bold text-slate-900 dark:text-white">
                      MacBook Pro 16"
                    </Text>
                    <Text className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      London, UK • Active Now
                    </Text>
                  </View>
                </View>
                <View className="h-2 w-2 rounded-full bg-emerald-500" />
              </View>
            </View>
          </View>

          <TouchableOpacity className="w-full py-4 items-center justify-center border-2 border-red-100 dark:border-red-900/30 rounded-2xl active:bg-red-50 dark:active:bg-red-900/10 mt-4">
            <Text className="text-sm font-bold uppercase tracking-widest text-red-600">
              Sign Out From All Devices
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>

      <BottomNav />
    </SafeAreaView>
  );
}
