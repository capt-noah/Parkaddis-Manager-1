import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  TrendingUp, 
  Clock, 
  CreditCard, 
  Banknote,
  Calendar,
  Users,
  ArrowLeft,
  ChevronDown,
  Activity,
  BarChart3
} from 'lucide-react-native';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { apiFetch } from '../lib/api';

const { width } = Dimensions.get('window');

interface Session {
  id: string;
  status: string;
  paymentStatus: string;
  startTime: string;
  accrued?: string;
  plateNumber: string;
}

export default function Analytics() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  const fetchData = async () => {
    setIsLoading(true);
    const result = await apiFetch<Session[]>('/reservation');
    if (result.ok && result.data) {
      const data = Array.isArray(result.data) 
        ? result.data 
        : (result.data as any).data || (result.data as any).reservations || [];
      setSessions(Array.isArray(data) ? data : []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const stats = useMemo(() => {
    const completed = sessions.filter(s => s.status === 'COMPLETED');
    const totalRevenue = completed.reduce((acc, s) => acc + (parseFloat(s.accrued || '0') || 40), 0);
    const avgDuration = completed.length > 0 ? "2.4h" : "0h"; // Mock calculation
    const occupancyRate = sessions.filter(s => s.status === 'ACTIVE').length / 50 * 100;

    return {
      totalRevenue: totalRevenue.toLocaleString(),
      totalSessions: sessions.length,
      completedSessions: completed.length,
      avgDuration,
      occupancyRate: Math.round(occupancyRate),
      cashRevenue: Math.round(totalRevenue * 0.7).toLocaleString(),
      transferRevenue: Math.round(totalRevenue * 0.3).toLocaleString()
    };
  }, [sessions]);

  // Mock chart data - In a real app, this would be calculated from sessions
  const chartData = [
    { label: '6am', value: 20 },
    { label: '9am', value: 45 },
    { label: '12pm', value: 85 },
    { label: '3pm', value: 60 },
    { label: '6pm', value: 75 },
    { label: '9pm', value: 30 },
  ];

  const maxChartValue = Math.max(...chartData.map(d => d.value));

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-slate-900" edges={['top']}>
      <TopBar />
      
      <ScrollView 
        className="flex-1 px-6 w-full"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#064e3b" />
        }
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6 mt-4">
          <View>
            <Text className="text-2xl font-headline font-bold text-slate-900 dark:text-white">Shift Analytics</Text>
            <Text className="text-slate-500 dark:text-slate-400 font-medium">Bole District Terminal</Text>
          </View>
          <TouchableOpacity className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 flex-row items-center gap-2 shadow-sm">
            <Calendar size={18} color={isDark ? "#64748b" : "#94a3b8"} />
            <Text className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{timeRange}</Text>
            <ChevronDown size={14} color={isDark ? "#64748b" : "#94a3b8"} />
          </TouchableOpacity>
        </View>

        {/* Top Stats Row */}
        <View className="flex-row gap-4 mb-6">
          <View className="flex-1 bg-primary dark:bg-emerald-900/40 p-5 rounded-[32px] shadow-lg shadow-primary/20">
            <Text className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1">Total Revenue</Text>
            <View className="flex-row items-baseline gap-1">
              <Text className="text-2xl font-headline font-bold text-white">{stats.totalRevenue}</Text>
              <Text className="text-[10px] font-bold text-white/70">ETB</Text>
            </View>
            <View className="mt-3 flex-row items-center gap-1">
              <TrendingUp size={12} color="#6ee7b7" />
              <Text className="text-[10px] font-bold text-emerald-300">+12.5% vs yesterday</Text>
            </View>
          </View>
          
          <View className="flex-1 bg-white dark:bg-slate-800 p-5 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm">
            <Text className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Active Now</Text>
            <View className="flex-row items-baseline gap-1">
              <Text className="text-2xl font-headline font-bold text-slate-900 dark:text-white">{stats.occupancyRate}%</Text>
              <Text className="text-[10px] font-bold text-slate-400">Load</Text>
            </View>
            <View className="mt-3 flex-row items-center gap-1">
              <Activity size={12} color="#3b82f6" />
              <Text className="text-[10px] font-bold text-blue-500 dark:text-blue-400">Peak flow detected</Text>
            </View>
          </View>
        </View>

        {/* Chart Section */}
        <View className="bg-white dark:bg-slate-800 rounded-[32px] p-6 border border-slate-100 dark:border-slate-700 shadow-sm mb-6">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-sm font-bold text-slate-900 dark:text-white">Occupancy Trend</Text>
              <Text className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Hourly traffic density</Text>
            </View>
            <BarChart3 size={20} color="#064e3b" />
          </View>
          
          <View className="flex-row items-end justify-between h-40 w-full px-2">
            {chartData.map((data, index) => (
              <View key={index} className="items-center gap-2">
                <View 
                  style={{ height: (data.value / maxChartValue) * 120 }} 
                  className={`w-8 rounded-t-xl ${index === 2 ? 'bg-primary' : 'bg-slate-100 dark:bg-slate-700'}`}
                />
                <Text className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{data.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Detailed Breakdown */}
        <Text className="text-[10px] font-headline font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">Financial Breakdown</Text>
        
        <View className="bg-white dark:bg-slate-800 rounded-[32px] overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm mb-6">
          <View className="p-5 flex-row items-center justify-between border-b border-slate-50 dark:border-slate-700">
            <View className="flex-row items-center gap-4">
              <View className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 items-center justify-center">
                <Banknote size={20} color="#d97706" />
              </View>
              <View>
                <Text className="text-sm font-bold text-slate-900 dark:text-white">Cash Collections</Text>
                <Text className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Physical handovers</Text>
              </View>
            </View>
            <Text className="text-sm font-bold text-slate-900 dark:text-white">ETB {stats.cashRevenue}</Text>
          </View>
          
          <View className="p-5 flex-row items-center justify-between border-b border-slate-50 dark:border-slate-700">
            <View className="flex-row items-center gap-4">
              <View className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 items-center justify-center">
                <CreditCard size={20} color="#2563eb" />
              </View>
              <View>
                <Text className="text-sm font-bold text-slate-900 dark:text-white">Digital Transfers</Text>
                <Text className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Chapa & Wallet</Text>
              </View>
            </View>
            <Text className="text-sm font-bold text-slate-900 dark:text-white">ETB {stats.transferRevenue}</Text>
          </View>
          
          <View className="p-5 flex-row items-center justify-between">
            <View className="flex-row items-center gap-4">
              <View className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 items-center justify-center">
                <Clock size={20} color="#059669" />
              </View>
              <View>
                <Text className="text-sm font-bold text-slate-900 dark:text-white">Avg. Stay Duration</Text>
                <Text className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Across all sessions</Text>
              </View>
            </View>
            <Text className="text-sm font-bold text-slate-900 dark:text-white">{stats.avgDuration}</Text>
          </View>
        </View>

        {/* Operational Stats */}
        <Text className="text-[10px] font-headline font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">Operations</Text>
        <View className="flex-row gap-4">
          <View className="flex-1 bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm items-center">
            <Users size={24} color="#64748b" className="mb-2" />
            <Text className="text-xl font-headline font-bold text-slate-900 dark:text-white">{stats.totalSessions}</Text>
            <Text className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Total Visits</Text>
          </View>
          <View className="flex-1 bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm items-center">
            <TrendingUp size={24} color="#64748b" className="mb-2" />
            <Text className="text-xl font-headline font-bold text-slate-900 dark:text-white">4.8</Text>
            <Text className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Turnover Rate</Text>
          </View>
          <TouchableOpacity 
            onPress={() => router.push('/sessions')}
            className="flex-1 bg-slate-50 dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm items-center border-dashed"
          >
            <Activity size={24} color="#064e3b" className="mb-2" />
            <Text className="text-xs font-bold text-primary dark:text-emerald-500 uppercase tracking-tighter">View Full Log</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}
