import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  Building, 
  Zap, 
  Clock, 
  Plus, 
  Trash2,
  CheckCircle2
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';

export default function FacilityConfig() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [capacity, setCapacity] = useState('150');
  const [hourlyRate, setHourlyRate] = useState('15');
  const [gracePeriod, setGracePeriod] = useState('15');
  const [rules, setRules] = useState([
    'No overnight parking without permit',
    'Vehicles must display valid ticket',
    'Maximum stay 24 hours'
  ]);

  const removeRule = (index: number) => {
    setRules(rules.filter((_: string, i: number) => i !== index));
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
          <Text className="text-xl font-headline font-bold text-slate-900 dark:text-white tracking-tight">Facility Configuration</Text>
        </View>

        {/* Config Sections */}
        <View className="gap-8">
          {/* Terminal Capacity */}
          <View>
            <Text className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 px-2">Terminal Capacity</Text>
            <View className="bg-white dark:bg-slate-800 rounded-[32px] p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
              <View className="flex-row items-center justify-between mb-6">
                <View className="flex-row items-center gap-4">
                  <View className="bg-primary/5 dark:bg-primary/10 p-3 rounded-2xl">
                    <Building size={20} color="#0066FF" />
                  </View>
                  <View>
                    <Text className="text-slate-900 dark:text-white font-bold">Total Slots</Text>
                    <Text className="text-slate-400 dark:text-slate-500 text-xs">Maximum vehicle capacity</Text>
                  </View>
                </View>
                <View className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-2">
                  <TextInput 
                    className="text-primary dark:text-emerald-500 font-bold text-lg"
                    keyboardType="numeric"
                    value={capacity}
                    onChangeText={setCapacity}
                  />
                </View>
              </View>
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-slate-900 dark:text-white font-bold">Auto-Full Mode</Text>
                  <Text className="text-slate-400 dark:text-slate-500 text-xs">Block entry when capacity is 100%</Text>
                </View>
                <Switch 
                  trackColor={{ false: isDark ? '#1e293b' : '#E2E8F0', true: '#064e3b' }}
                  thumbColor="#FFFFFF"
                  value={true}
                />
              </View>
            </View>
          </View>

          {/* Pricing & Rates */}
          <View>
            <Text className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 px-2">Pricing & Rates</Text>
            <View className="bg-white dark:bg-slate-800 rounded-[32px] p-6 border border-slate-100 dark:border-slate-700 shadow-sm gap-6">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-4">
                  <View className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-2xl">
                    <Zap size={20} color="#10B981" />
                  </View>
                  <View>
                    <Text className="text-slate-900 dark:text-white font-bold">Hourly Rate</Text>
                    <Text className="text-slate-400 dark:text-slate-500 text-xs">Base price per hour (ETB)</Text>
                  </View>
                </View>
                <View className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-2">
                  <TextInput 
                    className="text-emerald-600 dark:text-emerald-400 font-bold text-lg"
                    keyboardType="numeric"
                    value={hourlyRate}
                    onChangeText={setHourlyRate}
                  />
                </View>
              </View>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-4">
                  <View className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-2xl">
                    <Clock size={20} color="#F59E0B" />
                  </View>
                  <View>
                    <Text className="text-slate-900 dark:text-white font-bold">Grace Period</Text>
                    <Text className="text-slate-400 dark:text-slate-500 text-xs">Free minutes after entry</Text>
                  </View>
                </View>
                <View className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-2">
                  <TextInput 
                    className="text-amber-600 dark:text-amber-400 font-bold text-lg"
                    keyboardType="numeric"
                    value={gracePeriod}
                    onChangeText={setGracePeriod}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Special Rules */}
          <View>
            <Text className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 px-2">Special Rules</Text>
            <View className="bg-white dark:bg-slate-800 rounded-[32px] p-6 border border-slate-100 dark:border-slate-700 shadow-sm gap-4">
              {rules.map((rule: string, index: number) => (
                <View key={index} className="flex-row items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl">
                  <View className="flex-row items-center gap-3 flex-1">
                    <CheckCircle2 size={16} color="#10B981" />
                    <Text className="text-slate-700 dark:text-slate-300 text-xs font-medium flex-1">{rule}</Text>
                  </View>
                  <TouchableOpacity onPress={() => removeRule(index)}>
                    <Trash2 size={16} color="#F87171" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity className="flex-row items-center justify-center gap-2 py-4 border border-dashed border-slate-200 dark:border-slate-600 rounded-2xl">
                <Plus size={16} color={isDark ? "#475569" : "#94A3B8"} />
                <Text className="text-slate-400 dark:text-slate-500 font-bold text-xs">Add New Rule</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity className="bg-primary dark:bg-emerald-800 py-6 rounded-[32px] items-center shadow-lg shadow-primary/20 active:opacity-90 mt-4">
            <Text className="text-white text-lg font-bold">Save Configuration</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
