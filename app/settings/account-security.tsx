import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  Key, 
  Smartphone, 
  AlertCircle,
  ChevronRight,
  Lock
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';

export default function AccountSecurity() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [twoFactor, setTwoFactor] = useState(true);

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
          <Text className="text-xl font-headline font-bold text-slate-900 dark:text-white tracking-tight">Account Security</Text>
        </View>

        {/* Config Sections */}
        <View className="gap-8">
          {/* Authentication */}
          <View>
            <Text className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 px-2">Authentication</Text>
            <View className="bg-white dark:bg-slate-800 rounded-[32px] p-6 border border-slate-100 dark:border-slate-700 shadow-sm gap-6">
              <TouchableOpacity className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-4">
                  <View className="bg-primary/5 dark:bg-primary/10 p-3 rounded-2xl">
                    <Key size={20} color="#064e3b" />
                  </View>
                  <View>
                    <Text className="text-slate-900 dark:text-white font-bold">Change Access Key</Text>
                    <Text className="text-slate-400 dark:text-slate-500 text-xs">Update your terminal password</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#CBD5E1" />
              </TouchableOpacity>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-4">
                  <View className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-2xl">
                    <Smartphone size={20} color="#10B981" />
                  </View>
                  <View>
                    <Text className="text-slate-900 dark:text-white font-bold">Two-Factor Auth</Text>
                    <Text className="text-slate-400 dark:text-slate-500 text-xs">Secure login with mobile app</Text>
                  </View>
                </View>
                <Switch 
                  trackColor={{ false: isDark ? '#1e293b' : '#E2E8F0', true: '#064e3b' }}
                  thumbColor="#FFFFFF"
                  value={twoFactor}
                  onValueChange={setTwoFactor}
                />
              </View>
            </View>
          </View>

          {/* Active Sessions */}
          <View>
            <Text className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 px-2">Active Sessions</Text>
            <View className="bg-white dark:bg-slate-800 rounded-[32px] p-6 border border-slate-100 dark:border-slate-700 shadow-sm gap-4">
              <View className="flex-row items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl">
                <View className="flex-row items-center gap-3">
                  <Smartphone size={16} color="#64748B" />
                  <View>
                    <Text className="text-slate-900 dark:text-white font-bold text-xs">iPhone 15 Pro • Current</Text>
                    <Text className="text-slate-400 dark:text-slate-500 text-[10px]">Addis Ababa, Ethiopia</Text>
                  </View>
                </View>
                <View className="bg-emerald-500 w-2 h-2 rounded-full" />
              </View>
              <View className="flex-row items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl">
                <View className="flex-row items-center gap-3">
                  <Smartphone size={16} color="#64748B" />
                  <View>
                    <Text className="text-slate-900 dark:text-white font-bold text-xs">Samsung S24 Ultra</Text>
                    <Text className="text-slate-400 dark:text-slate-500 text-[10px]">2 days ago • Terminal 02</Text>
                  </View>
                </View>
                <TouchableOpacity>
                  <Text className="text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase tracking-wider">Revoke</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Security Log */}
          <View>
            <Text className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 px-2">Security Audit Log</Text>
            <View className="bg-white dark:bg-slate-800 rounded-[32px] p-6 border border-slate-100 dark:border-slate-700 shadow-sm gap-4">
              {[
                { event: 'Password Changed', time: '2h ago', icon: Lock, color: isDark ? '#10b981' : '#064e3b' },
                { event: 'Failed Login Attempt', time: '5h ago', icon: AlertCircle, color: '#E11D48' },
                { event: 'New Device Authorized', time: 'Yesterday', icon: Smartphone, color: '#10B981' },
              ].map((log, index) => (
                <View key={index} className="flex-row items-center justify-between py-2">
                  <View className="flex-row items-center gap-3">
                    <View style={{ backgroundColor: `${log.color}20` }} className="p-2 rounded-xl">
                      <log.icon size={16} color={log.color} />
                    </View>
                    <View>
                      <Text className="text-slate-900 dark:text-white font-bold text-xs">{log.event}</Text>
                      <Text className="text-slate-400 dark:text-slate-500 text-[10px]">{log.time}</Text>
                    </View>
                  </View>
                  <ChevronRight size={16} color={isDark ? "#475569" : "#CBD5E1"} />
                </View>
              ))}
              <TouchableOpacity className="mt-2 items-center">
                <Text className="text-primary dark:text-emerald-500 text-xs font-bold">View Full Audit Log</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
