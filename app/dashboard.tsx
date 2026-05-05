import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  TrendingUp, 
  Car, 
  ArrowRight, 
  Clock, 
  CreditCard, 
  CheckCircle2, 
  QrCode,
  ChevronRight,
  ShieldCheck as BadgeIcon
} from 'lucide-react-native';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import TicketCard from '../components/TicketCard';
import BottomSheet from '../components/BottomSheet';
import { DashboardSkeleton } from '../components/Skeleton';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';

interface Session {
  id: string;
  plateNumber: string;
  carModel: string;
  carColor: string;
  startTime: string;
  endTime: string;
  status: 'RESERVED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID';
  duration?: string; // Optional field for UI display convenience
  accrued?: string;  // Optional field for UI display convenience
}

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState({ revenue: '0', occupancy: 0, slots: 0 });
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const result = await apiFetch<Session[]>('/reservation');
    
    if (result.ok && result.data) {
      // Handle potential wrapped response { data: [...] } or direct array [...]
      const sessions = Array.isArray(result.data) 
        ? result.data 
        : (result.data as any).data || (result.data as any).reservations || [];

      if (!Array.isArray(sessions)) {
        setActiveSessions([]);
        setStats({ revenue: '0', occupancy: 0, slots: 50 });
        setIsLoading(false);
        return;
      }

      // Filter for active/reserved sessions for the live feed
      const active = sessions.filter(s => s.status === 'ACTIVE' || s.status === 'RESERVED');
      setActiveSessions(active);
      
      // Calculate simple stats from data
      const totalRevenue = sessions
        .filter(s => s.paymentStatus === 'PAID')
        .reduce((acc, s) => acc + 40, 0); // Mock value if price not in session object
        
      setStats({
        revenue: totalRevenue.toString(),
        occupancy: Math.min(Math.round((active.length / 50) * 100), 100), // Assuming 50 total slots
        slots: Math.max(0, 50 - active.length)
      });
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

  const handleCheckout = async () => {
    if (!selectedSession) return;
    setIsCheckingOut(true);
    setCheckoutError(null);
    const result = await apiFetch<any>('/reservation/complete', {
      method: 'POST',
      body: JSON.stringify({ reservationId: selectedSession.id }),
    });
    setIsCheckingOut(false);
    if (result.ok) {
      setIsCheckoutOpen(false);
      await fetchData();
      router.push('/checkout-success');
    } else {
      setCheckoutError(result.error || 'Checkout failed. Please try again.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-slate-900" edges={['top']}>
      <TopBar />
      
      {isLoading ? (
        <DashboardSkeleton />
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
              <Text className="text-3xl font-headline font-bold text-slate-900 dark:text-white">Welcome Back,</Text>
              <Text className="text-slate-500 dark:text-slate-400 font-medium">Bole District Terminal Manager</Text>
            </View>

            {/* Current Occupancy */}
            <View className="bg-primary rounded-[32px] p-6 shadow-lg overflow-hidden mb-8 relative">
              <View className="relative z-10 w-full">
                <View className="flex-row justify-between items-start mb-2">
                  <Text className="text-[10px] font-bold text-white uppercase tracking-widest opacity-80 mt-1">Current Occupancy</Text>
                  <View className="bg-white/20 px-3 py-1 rounded-full">
                    <Text className="text-white text-[10px] font-bold uppercase tracking-wider">Live View</Text>
                  </View>
                </View>
                <View className="flex-row items-baseline gap-2">
                  <Text className="text-5xl font-headline font-extrabold text-white">{stats.occupancy}%</Text>
                  <View className="flex-row items-center bg-white/10 px-2 py-1 rounded-full">
                    <TrendingUp size={16} color="#6ee7b7" />
                    <Text className="text-emerald-300 text-xs font-bold ml-1">+5%</Text>
                  </View>
                </View>
                <View className="mt-4 w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <View className="bg-white h-full rounded-full" style={{ width: `${stats.occupancy}%` }} />
                </View>
              </View>
              <View className="absolute -right-4 -bottom-4 opacity-10">
                <Text className="text-[120px] font-extrabold text-white">P</Text>
              </View>
            </View>

            <View className="flex-row gap-3 mb-8">
              <View className="flex-1 bg-white dark:bg-slate-800 p-5 rounded-[28px] border border-slate-100 dark:border-slate-700 shadow-sm shadow-slate-200">
                <Text className="text-[10px] font-headline font-extrabold uppercase tracking-widest text-slate-400 mb-2">Revenue</Text>
                <View className="flex-row items-end gap-1">
                  <Text className="text-2xl font-headline font-bold text-slate-900 dark:text-white">{stats.revenue}</Text>
                  <Text className="text-xs font-bold text-slate-400 mb-1">ETB</Text>
                </View>
              </View>
              <View className="flex-1 bg-white dark:bg-slate-800 p-5 rounded-[28px] border border-slate-100 dark:border-slate-700 shadow-sm shadow-slate-200">
                <Text className="text-[10px] font-headline font-extrabold uppercase tracking-widest text-slate-400 mb-2">Available</Text>
                <View className="flex-row items-end gap-1">
                  <Text className="text-2xl font-headline font-bold text-slate-900 dark:text-white">{stats.slots}</Text>
                  <Text className="text-xs font-bold text-slate-400 mb-1">Slots</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Live Feed */}
          <View className="flex-row justify-between items-end mb-4">
            <View>
              <Text className="text-xl font-headline font-bold text-slate-900 dark:text-white">Live Feed</Text>
              <Text className="text-xs text-slate-500 dark:text-slate-400">Monitoring active sessions</Text>
            </View>
            <TouchableOpacity 
              onPress={() => router.push('/sessions')}
              className="flex-row items-center bg-primary/5 dark:bg-primary/10 px-3 py-1.5 rounded-xl"
            >
              <Text className="text-primary dark:text-emerald-500 text-[10px] font-bold uppercase tracking-wider">View All</Text>
              <ArrowRight size={12} color="#064e3b" className="ml-1" />
            </TouchableOpacity>
          </View>

          <View className="gap-4">
            {activeSessions.map((session, idx) => (
              <TouchableOpacity 
                key={session.id} 
                className="bg-white dark:bg-slate-800 p-5 rounded-[28px] border border-slate-100 dark:border-slate-700 flex-row items-center justify-between"
                onPress={() => {
                  setSelectedSession(session);
                  setIsCheckoutOpen(true);
                }}
              >
                <View className="flex-row items-center gap-4">
                  <View className={`w-12 h-12 rounded-2xl items-center justify-center ${session.status === 'ACTIVE' ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-blue-50 dark:bg-blue-500/10'}`}>
                    <BadgeIcon size={24} color={session.status === 'ACTIVE' ? '#059669' : '#2563eb'} />
                  </View>
                  <View>
                    <Text className="text-slate-900 dark:text-white font-headline font-bold">{session.plateNumber}</Text>
                    <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {session.status} • {session.paymentStatus}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#94a3b8" />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

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
                  <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Plate Number</Text>
                  <Text className="text-2xl font-headline font-bold text-slate-900 dark:text-white">{selectedSession.plateNumber}</Text>
                </View>
              </View>

              <View className="flex-row gap-4 w-full">
                <View className="bg-white dark:bg-slate-700 p-4 rounded-2xl border border-slate-100 dark:border-slate-600 flex-1">
                  <View className="flex-row items-center gap-1 mb-1">
                    <Clock size={14} color="#94a3b8" />
                    <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Duration</Text>
                  </View>
                  <Text className="text-lg font-bold text-slate-900 dark:text-white">{selectedSession.duration || '0h'}</Text>
                </View>
                <View className="bg-white dark:bg-slate-700 p-4 rounded-2xl border border-slate-100 dark:border-slate-600 flex-1">
                  <View className="flex-row items-center gap-1 mb-1">
                    <CreditCard size={14} color="#94a3b8" />
                    <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Rate</Text>
                  </View>
                  <Text className="text-lg font-bold text-slate-900 dark:text-white">40 ETB/hr</Text>
                </View>
              </View>

              <View className="mt-6 pt-6 w-full border-t border-dashed border-slate-200 dark:border-slate-600">
                <View className="flex-row justify-between items-center w-full">
                  <Text className="text-slate-500 dark:text-slate-400 font-medium">Total Fee</Text>
                  <Text className="text-3xl font-headline font-extrabold text-primary dark:text-emerald-500">ETB {selectedSession.accrued}</Text>
                </View>
              </View>
            </View>

            <View className="gap-3 w-full">
              {checkoutError && (
                <View className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-900/30">
                  <Text className="text-red-600 dark:text-red-400 text-xs font-bold text-center">{checkoutError}</Text>
                </View>
              )}
              <TouchableOpacity 
                onPress={handleCheckout}
                disabled={isCheckingOut}
                className={`w-full py-5 rounded-2xl items-center justify-center flex-row gap-2 shadow-lg shadow-primary/20 ${
                  isCheckingOut ? 'bg-primary/60' : 'bg-primary dark:bg-emerald-800 active:opacity-80'
                }`}
              >
                <CheckCircle2 size={24} color="white" />
                <Text className="text-white font-headline font-bold uppercase tracking-widest">
                  {isCheckingOut ? 'Processing...' : 'Confirm Checkout'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => { setIsCheckoutOpen(false); setCheckoutError(null); }}
                className="w-full bg-slate-100 dark:bg-slate-700 py-4 rounded-2xl items-center justify-center active:bg-slate-200 dark:active:bg-slate-600"
              >
                <Text className="text-slate-600 dark:text-slate-300 font-headline font-bold uppercase tracking-widest">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </BottomSheet>

      <BottomNav />
    </SafeAreaView>
  );
}
