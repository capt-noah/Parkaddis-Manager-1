import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle2, Share2, Download, ArrowLeft, Printer, Home, Loader2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { apiFetch } from '../lib/api';

interface Reservation {
  id: string;
  plateNumber: string;
  duration: string;
  accrued: string;
  paymentStatus: string;
}

export default function CheckoutSuccess() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { reservationId } = useLocalSearchParams<{ reservationId: string }>();
  const [reservation, setReservation] = React.useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchReservation() {
      if (!reservationId) {
        setIsLoading(false);
        return;
      }
      
      const result = await apiFetch<Reservation[]>('/reservation');
      if (result.ok && result.data) {
        // Handle potential wrapped response { data: [...] } or direct array [...]
        const sessions = Array.isArray(result.data) 
          ? result.data 
          : (result.data as any).data || (result.data as any).reservations || [];
          
        if (Array.isArray(sessions)) {
          const found = sessions.find(r => r.id === reservationId);
          if (found) {
            setReservation(found);
          }
        }
      }
      setIsLoading(false);
    }

    fetchReservation();
  }, [reservationId]);

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-slate-900" edges={['top', 'bottom']}>
      
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Loader2 size={48} color={isDark ? "#10b981" : "#059669"} className="animate-spin" />
        </View>
      ) : reservation ? (
        <ScrollView 
          contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 24, paddingTop: 40, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full max-lg items-center">
            <View className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/20 rounded-full items-center justify-center mb-6">
              <CheckCircle2 size={56} color={isDark ? "#10b981" : "#059669"} />
            </View>

            <Text className="text-3xl font-headline font-bold text-slate-900 dark:text-white text-center mb-2">Check-out Successful</Text>
            <Text className="text-slate-500 dark:text-slate-400 text-center mb-10 mx-6">The vehicle has been successfully checked out and the session is closed.</Text>

            {/* Digital Receipt Card */}
            <View className="w-full bg-white dark:bg-slate-800 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden mb-8">
              <View className="bg-primary dark:bg-emerald-800 p-6 flex-row justify-between items-center">
                <View>
                  <Text className="text-[10px] text-white font-bold uppercase tracking-[0.2em] opacity-80 mb-1">Transaction ID</Text>
                  <Text className="text-white font-bold text-sm">#{reservation.id.substring(0, 10).toUpperCase()}</Text>
                </View>
                <Printer size={24} color="rgba(255,255,255,0.6)" />
              </View>
              
              <View className="p-8 gap-6">
                <View className="flex-row justify-between items-center">
                  <Text className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest">Plate Number</Text>
                  <Text className="text-slate-900 dark:text-white font-bold text-lg">{reservation.plateNumber}</Text>
                </View>
                
                <View className="flex-row justify-between items-center">
                  <Text className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest">Total Duration</Text>
                  <Text className="text-slate-900 dark:text-white font-bold text-lg">{reservation.duration || 'N/A'}</Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest">Payment Method</Text>
                  <Text className="text-slate-900 dark:text-white font-bold text-lg">Digital Wallet</Text>
                </View>

                <View className="pt-6 border-t border-dashed border-slate-200 dark:border-slate-700 flex-row justify-between items-center w-full mt-2">
                  <Text className="text-primary dark:text-emerald-500 font-bold text-sm uppercase tracking-widest">Total Paid</Text>
                  <Text className="text-3xl font-headline font-extrabold text-primary dark:text-emerald-500">ETB {reservation.accrued || '0'}</Text>
                </View>
              </View>

              {/* Notch */}
              <View className="relative h-6 flex-row items-center overflow-hidden w-full px-8">
                <View className="w-full absolute left-8 right-8" style={{ height: 1, borderWidth: 1, borderTopColor: 'transparent', borderBottomColor: isDark ? '#334155' : '#f1f5f9', borderStyle: 'dashed' }} />
                <View className="absolute w-6 h-6 bg-background dark:bg-slate-900 rounded-full -left-3 top-0" />
                <View className="absolute w-6 h-6 bg-background dark:bg-slate-900 rounded-full -right-3 top-0" />
              </View>
              
              <View className="p-6 bg-slate-50 dark:bg-slate-900/50 flex-row justify-center items-center gap-4 border-t border-slate-100 dark:border-slate-700">
                <TouchableOpacity className="flex-row items-center gap-2 active:opacity-70">
                  <Download size={16} color={isDark ? "#94a3b8" : "#475569"} />
                  <Text className="text-slate-600 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">Save PDF</Text>
                </TouchableOpacity>
                <View className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-2" />
                <TouchableOpacity className="flex-row items-center gap-2 active:opacity-70">
                  <Share2 size={16} color={isDark ? "#94a3b8" : "#475569"} />
                  <Text className="text-slate-600 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">Share</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="w-full gap-3">
              <TouchableOpacity 
                onPress={() => router.push('/dashboard')}
                className="w-full bg-primary dark:bg-emerald-800 py-5 rounded-2xl flex-row items-center justify-center gap-3 active:opacity-80 shadow-lg shadow-primary/20"
              >
                <Home size={20} color="white" />
                <Text className="text-white font-headline font-bold text-base uppercase tracking-widest">Back to Dashboard</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => router.push('/scanner')}
                className="w-full bg-slate-100 dark:bg-slate-800 py-4 rounded-2xl flex-row items-center justify-center gap-2 active:bg-slate-200 dark:active:bg-slate-700"
              >
                <ArrowLeft size={16} color={isDark ? "#94a3b8" : "#475569"} />
                <Text className="text-slate-600 dark:text-slate-400 font-headline font-bold text-sm uppercase tracking-widest">Scan Another</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center p-8">
          <Text className="text-slate-900 dark:text-white font-headline font-bold text-xl text-center">Receipt Not Found</Text>
          <TouchableOpacity
            onPress={() => router.push('/dashboard')}
            className="mt-6 bg-primary px-8 py-3 rounded-xl"
          >
            <Text className="text-white font-bold">Return to Dashboard</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
