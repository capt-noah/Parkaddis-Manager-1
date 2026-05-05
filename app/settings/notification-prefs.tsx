import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  Bell, 
  Mail, 
  Smartphone, 
  MessageSquare, 
  AlertTriangle, 
  TrendingUp, 
  ShieldAlert
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';

export default function NotificationPrefs() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [prefs, setPrefs] = useState({
    push: true,
    email: false,
    sms: true,
    occupancy: true,
    revenue: true,
    security: true,
  });

  const togglePref = (key: keyof typeof prefs) => {
    setPrefs({ ...prefs, [key]: !prefs[key] });
  };

  const iconColor = isDark ? "#64748b" : "#475569";

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-slate-900" edges={['top']}>
      <ScrollView 
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header — matches settings page style */}
        <View className="flex-row items-center gap-4 mb-8">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="p-2 -mx-2 rounded-full"
          >
            <ChevronLeft size={24} color={iconColor} />
          </TouchableOpacity>
          <Text className="text-xl font-headline font-bold text-slate-900 dark:text-white tracking-tight">Notification Preferences</Text>
        </View>

        {/* Config Sections */}
        <View className="gap-8">
          {/* Delivery Channels */}
          <View>
            <Text className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 px-2">Delivery Channels</Text>
            <View className="bg-white dark:bg-slate-800 rounded-[32px] p-6 border border-slate-100 dark:border-slate-700 shadow-sm gap-6">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-4">
                  <View className="bg-primary/5 dark:bg-primary/10 p-3 rounded-2xl">
                    <Smartphone size={20} color="#064e3b" />
                  </View>
                  <View>
                    <Text className="text-slate-900 dark:text-white font-bold">Push Notifications</Text>
                    <Text className="text-slate-400 dark:text-slate-500 text-xs">Real-time terminal alerts</Text>
                  </View>
                </View>
                <Switch 
                  trackColor={{ false: isDark ? '#1e293b' : '#E2E8F0', true: '#064e3b' }}
                  thumbColor="#FFFFFF"
                  value={prefs.push}
                  onValueChange={() => togglePref('push')}
                />
              </View>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-4">
                  <View className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl">
                    <Mail size={20} color={isDark ? "#94a3b8" : "#64748B"} />
                  </View>
                  <View>
                    <Text className="text-slate-900 dark:text-white font-bold">Email Reports</Text>
                    <Text className="text-slate-400 dark:text-slate-500 text-xs">Daily & weekly summaries</Text>
                  </View>
                </View>
                <Switch 
                  trackColor={{ false: isDark ? '#1e293b' : '#E2E8F0', true: '#064e3b' }}
                  thumbColor="#FFFFFF"
                  value={prefs.email}
                  onValueChange={() => togglePref('email')}
                />
              </View>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-4">
                  <View className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl">
                    <MessageSquare size={20} color={isDark ? "#94a3b8" : "#64748B"} />
                  </View>
                  <View>
                    <Text className="text-slate-900 dark:text-white font-bold">SMS Alerts</Text>
                    <Text className="text-slate-400 dark:text-slate-500 text-xs">Critical system warnings</Text>
                  </View>
                </View>
                <Switch 
                  trackColor={{ false: isDark ? '#1e293b' : '#E2E8F0', true: '#064e3b' }}
                  thumbColor="#FFFFFF"
                  value={prefs.sms}
                  onValueChange={() => togglePref('sms')}
                />
              </View>
            </View>
          </View>

          {/* Alert Categories */}
          <View>
            <Text className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 px-2">Alert Categories</Text>
            <View className="bg-white dark:bg-slate-800 rounded-[32px] p-6 border border-slate-100 dark:border-slate-700 shadow-sm gap-6">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-4">
                  <View className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-2xl">
                    <AlertTriangle size={20} color="#F59E0B" />
                  </View>
                  <View>
                    <Text className="text-slate-900 dark:text-white font-bold">Occupancy Alerts</Text>
                    <Text className="text-slate-400 dark:text-slate-500 text-xs">When terminal is near full</Text>
                  </View>
                </View>
                <Switch 
                  trackColor={{ false: isDark ? '#1e293b' : '#E2E8F0', true: '#064e3b' }}
                  thumbColor="#FFFFFF"
                  value={prefs.occupancy}
                  onValueChange={() => togglePref('occupancy')}
                />
              </View>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-4">
                  <View className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-2xl">
                    <TrendingUp size={20} color="#10B981" />
                  </View>
                  <View>
                    <Text className="text-slate-900 dark:text-white font-bold">Revenue Alerts</Text>
                    <Text className="text-slate-400 dark:text-slate-500 text-xs">Daily earnings milestones</Text>
                  </View>
                </View>
                <Switch 
                  trackColor={{ false: isDark ? '#1e293b' : '#E2E8F0', true: '#064e3b' }}
                  thumbColor="#FFFFFF"
                  value={prefs.revenue}
                  onValueChange={() => togglePref('revenue')}
                />
              </View>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-4">
                  <View className="bg-rose-50 dark:bg-rose-900/20 p-3 rounded-2xl">
                    <ShieldAlert size={20} color="#E11D48" />
                  </View>
                  <View>
                    <Text className="text-slate-900 dark:text-white font-bold">Security Alerts</Text>
                    <Text className="text-slate-400 dark:text-slate-500 text-xs">Unauthorized access attempts</Text>
                  </View>
                </View>
                <Switch 
                  trackColor={{ false: isDark ? '#1e293b' : '#E2E8F0', true: '#064e3b' }}
                  thumbColor="#FFFFFF"
                  value={prefs.security}
                  onValueChange={() => togglePref('security')}
                />
              </View>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity className="bg-primary dark:bg-emerald-800 py-6 rounded-[32px] items-center shadow-lg shadow-primary/20 active:opacity-90">
            <Text className="text-white text-lg font-bold">Save Preferences</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
