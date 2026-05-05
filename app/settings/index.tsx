import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  Settings as SettingsIcon, 
  Building2, 
  Bell, 
  Users, 
  Shield, 
  Monitor,
  Sun,
  Moon,
  ChevronRight,
  LogOut,
  HelpCircle,
  Info
} from 'lucide-react-native';
import { SettingsSkeleton } from '../../components/Skeleton';
import BottomSheet from '../../components/BottomSheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';

export default function Settings() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isThemeSheetOpen, setIsThemeSheetOpen] = useState(false);
  const { theme: currentTheme, setTheme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const themeOptions = [
    { id: 'system', title: 'System Default', icon: Monitor, bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-600 dark:text-white', color: '#475569' },
    { id: 'light', title: 'Light Mode', icon: Sun, bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600', color: '#d97706' },
    { id: 'dark', title: 'Dark Mode', icon: Moon, bg: 'bg-slate-900 dark:bg-slate-700', text: 'text-white', color: 'white' }
  ];

  const settingsGroups = [
    {
      title: "General Configuration",
      items: [
        {
          id: "facility",
          title: "Facility Configuration",
          subtitle: "Terminal capacity, rates & rules",
          icon: Building2,
          bg: "bg-blue-50 dark:bg-blue-900/20",
          color: "#2563eb",
          path: "/settings/facility-config"
        },
        {
          id: "notifications",
          title: "Notification Preferences",
          subtitle: "Alerts, reports & system updates",
          icon: Bell,
          bg: "bg-amber-50 dark:bg-amber-900/20",
          color: "#d97706",
          path: "/settings/notification-prefs"
        }
      ]
    },
    {
      title: "Appearance",
      items: [
        {
          id: "theme",
          title: "Display Theme",
          subtitle: currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1),
          icon: currentTheme === 'light' ? Sun : currentTheme === 'dark' ? Moon : Monitor,
          bg: currentTheme === 'light' ? "bg-amber-50 dark:bg-amber-900/20" : currentTheme === 'dark' ? "bg-slate-900 dark:bg-slate-700" : "bg-slate-100 dark:bg-slate-700",
          color: currentTheme === 'light' ? "#d97706" : currentTheme === 'dark' ? "white" : "#475569",
          onClick: () => setIsThemeSheetOpen(true)
        }
      ]
    },
    {
      title: "Administration",
      items: [
        {
          id: "staff",
          title: "Staff Management",
          subtitle: "Manage roles & permissions",
          icon: Users,
          bg: "bg-emerald-50 dark:bg-emerald-900/20",
          color: "#059669",
          path: "/settings/staff-management"
        },
        {
          id: "security",
          title: "Account Security",
          subtitle: "Password, 2FA & active sessions",
          icon: Shield,
          bg: "bg-indigo-50 dark:bg-indigo-900/20",
          color: "#4f46e5",
          path: "/settings/account-security"
        }
      ]
    },
    {
      title: "Support & Legal",
      items: [
        {
          id: "help",
          title: "Help Center",
          subtitle: "FAQs & technical support",
          icon: HelpCircle,
          bg: "bg-slate-100 dark:bg-slate-700",
          color: "#475569",
          path: "#"
        },
        {
          id: "about",
          title: "About ParkAddis",
          subtitle: "Version 2.4.1-STABLE",
          icon: Info,
          bg: "bg-slate-100 dark:bg-slate-700",
          color: "#475569",
          path: "#"
        }
      ]
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-slate-900" edges={['top']}>
      {isLoading ? (
        <SettingsSkeleton />
      ) : (
        <ScrollView 
          className="flex-1 px-6 w-full pt-6"
          contentContainerStyle={{ paddingBottom: 72 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="flex-row items-center gap-4 mb-6">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="p-2 -mx-2 rounded-full"
            >
              <ChevronLeft size={24} color="#475569" />
            </TouchableOpacity>
            <Text className="text-xl font-headline font-bold text-slate-900 dark:text-white tracking-tight">Settings</Text>
          </View>

          {/* Settings List */}
          <View className="gap-8 flex-row flex-wrap justify-between w-full">
            {settingsGroups.map((group, idx) => (
              <View key={idx} className="w-full">
                <Text className="text-[10px] font-headline font-extrabold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4 px-2">
                  {group.title}
                </Text>
                <View className="bg-white dark:bg-slate-800 rounded-[32px] overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
                  {group.items.map((item, itemIdx) => (
                    <View key={item.id}>
                      <TouchableOpacity 
                        onPress={() => {
                          if ('path' in item && typeof item.path === 'string' && item.path !== '#') {
                            router.push(item.path as any);
                          } else if ('onClick' in item && typeof item.onClick === 'function') {
                            item.onClick();
                          }
                        }}
                        className="flex-row items-center justify-between p-5 active:bg-slate-50 dark:active:bg-slate-700"
                      >
                        <View className="flex-row items-center gap-4">
                          <View className={`w-12 h-12 rounded-2xl ${item.bg} items-center justify-center`}>
                            <item.icon size={24} color={item.color} />
                          </View>
                          <View>
                            <Text className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</Text>
                            <Text className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wide">{item.subtitle}</Text>
                          </View>
                        </View>
                        <ChevronRight size={20} color="#94a3b8" />
                      </TouchableOpacity>
                      {itemIdx < group.items.length - 1 && (
                        <View className="h-[1px] bg-slate-100 dark:bg-slate-700 mx-5" />
                      )}
                    </View>
                  ))}
                </View>
              </View>
            ))}

            {/* Logout Section */}
            <View className="pt-4 w-full">
              <TouchableOpacity className="flex-row items-center justify-between p-6 bg-red-50 dark:bg-red-900/10 rounded-[32px] border border-red-100 dark:border-red-900/30 active:bg-red-100">
                <View className="flex-row items-center gap-4">
                  <View className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 items-center justify-center shadow-sm">
                    <LogOut size={24} color="#dc2626" />
                  </View>
                  <View>
                    <Text className="text-xs font-bold text-red-600 dark:text-red-400">Logout Session</Text>
                    <Text className="text-[10px] text-red-600/60 dark:text-red-400/60 font-medium uppercase tracking-wide">Securely end your session</Text>
                  </View>
                </View>
                <ChevronRight size={24} color="#fca5a5" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}

      <BottomSheet
        isOpen={isThemeSheetOpen}
        onClose={() => setIsThemeSheetOpen(false)}
        title="Display Theme"
        subtitle="Choose your preferred appearance"
      >
        <View className="gap-3 w-full mt-4">
          {themeOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              onPress={() => {
                setTheme(option.id as any);
                setIsThemeSheetOpen(false);
              }}
              className={`w-full flex-row items-center justify-between p-5 rounded-2xl border ${
                currentTheme === option.id 
                  ? 'bg-primary/5 dark:bg-primary/10 border-primary/20 dark:border-primary/40' 
                  : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'
              }`}
            >
              <View className="flex-row items-center gap-4">
                <View className={`w-12 h-12 rounded-xl ${option.bg} items-center justify-center shadow-sm`}>
                  <option.icon size={24} color={option.color} />
                </View>
                <View>
                  <Text className={`text-sm font-bold ${currentTheme === option.id ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                    {option.title}
                  </Text>
                  <Text className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wide">
                    {option.id === 'system' ? 'Follow device settings' : `Use ${option.id} mode`}
                  </Text>
                </View>
              </View>
              {currentTheme === option.id && (
                <View className="w-6 h-6 bg-primary rounded-full items-center justify-center">
                  <View className="w-2 h-2 bg-white rounded-full" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}
