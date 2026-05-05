import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle, QrCode, Car, MapPin, Printer, ArrowLeft, Loader2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiFetch } from '../lib/api';

interface Reservation {
  id: string;
  plateNumber: string;
  carModel: string;
  carColor: string;
  startTime: string;
  locationName: string;
  spotId: string;
}

export default function Success() {
  const router = useRouter();
  const { reservationId } = useLocalSearchParams<{ reservationId: string }>();
  const [reservation, setReservation] = React.useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchReservation() {
      if (!reservationId) {
        setIsLoading(false);
        return;
      }
      
      // Since there is no GET /api/reservation/:id, we fetch from the list
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
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Top Bar */}
      <View className="px-6 py-4 flex-row items-center gap-4 border-b border-slate-100 z-50">
        <TouchableOpacity
          onPress={() => router.push('/dashboard')}
          className="p-2 -mx-2 rounded-full active:bg-slate-100"
        >
          <ArrowLeft size={24} color="#064e3b" />
        </TouchableOpacity>
        <Text className="font-headline font-bold tracking-tight text-2xl text-primary">Check-in Success</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Loader2 size={48} color="#064e3b" className="animate-spin" />
          <Text className="text-slate-500 font-bold uppercase tracking-widest mt-4">Validating Ticket...</Text>
        </View>
      ) : reservation ? (
        <ScrollView 
          contentContainerStyle={{ alignItems: 'center', padding: 24, paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full max-w-2xl items-center">
            {/* Success Icon */}
            <View className="relative mb-8 mt-4">
              <View className="w-24 h-24 bg-white rounded-full items-center justify-center shadow-sm">
                <View className="w-20 h-20 bg-emerald-50 rounded-full items-center justify-center">
                  <CheckCircle size={48} color="#064e3b" />
                </View>
              </View>
              <View className="absolute -top-1 -right-1">
                <View className="w-4 h-4 bg-emerald-500 rounded-full border border-white" />
              </View>
            </View>

            <View className="items-center mb-10">
              <Text className="text-2xl font-headline font-bold text-slate-900 mb-2 tracking-tight">Vehicle Checked In</Text>
              <Text className="text-slate-500 font-medium text-center">The vehicle has been successfully assigned to a spot.</Text>
            </View>

            {/* Ticket Card */}
            <View className="w-full bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
              {/* Ticket Header */}
              <View className="p-8 pb-6">
                <View className="flex-row justify-between items-start mb-4">
                  <View>
                    <Text className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">PLATE NUMBER</Text>
                    <Text className="text-3xl font-extrabold tracking-tight text-primary font-headline">{reservation.plateNumber}</Text>
                  </View>
                  <View className="bg-primary/5 p-3 rounded-2xl">
                    <QrCode size={32} color="#064e3b" />
                  </View>
                </View>
                <View className="flex-row items-center gap-3 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100">
                  <Car size={24} color="#064e3b" />
                  <View>
                    <Text className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ASSIGNED SLOT</Text>
                    <Text className="text-lg font-headline font-bold text-slate-900">{reservation.spotId || 'N/A'}</Text>
                  </View>
                </View>
              </View>

              {/* Perforation Line */}
              <View className="relative h-6 flex-row items-center overflow-hidden w-full">
                <View className="w-full absolute" style={{ height: 1, borderWidth: 1, borderTopColor: 'transparent', borderBottomColor: '#f1f5f9', borderStyle: 'dashed' }} />
                <View className="absolute w-6 h-6 bg-background rounded-full -left-3 top-0" />
                <View className="absolute w-6 h-6 bg-background rounded-full -right-3 top-0" />
              </View>

              {/* Ticket Details */}
              <View className="p-8 pt-6 flex-row justify-between w-full">
                <View>
                  <Text className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">VEHICLE</Text>
                  <Text className="text-sm font-bold text-slate-900">{reservation.carModel || 'Unknown'}</Text>
                  <Text className="text-[12px] font-medium text-slate-500 mt-0.5">Color: {reservation.carColor || 'N/A'}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">ENTRY TIME</Text>
                  <Text className="text-sm font-bold text-slate-900">{new Date(reservation.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                  <Text className="text-[12px] font-medium text-slate-500 mt-0.5">{new Date(reservation.startTime).toLocaleDateString()}</Text>
                </View>
              </View>

              {/* Map Preview */}
              <View className="h-24 bg-slate-50 w-full relative overflow-hidden">
                <Image
                  source={{ uri: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" }}
                  className="w-full h-full opacity-20"
                  style={{ tintColor: 'gray' } as any}
                />
                <View className="absolute inset-0 items-center justify-center">
                  <View className="px-4 py-1.5 bg-white shadow-sm rounded-full flex-row items-center gap-1.5 border border-primary/10">
                    <MapPin size={12} color="#064e3b" />
                    <Text className="text-[10px] font-bold text-primary uppercase">{reservation.locationName || 'MAIN SECTION'}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="w-full mt-12 gap-4">
              <TouchableOpacity className="w-full bg-primary py-4 rounded-xl flex-row items-center justify-center gap-3 active:opacity-80 shadow-lg shadow-primary/20">
                <Printer size={20} color="white" />
                <Text className="text-white font-headline font-bold text-base">Print Entry Ticket</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/dashboard')}
                className="w-full bg-transparent py-4 rounded-xl flex-row items-center justify-center gap-2 active:bg-emerald-50"
              >
                <Text className="text-primary font-headline font-bold text-base">Back to Dashboard</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center p-8">
          <Text className="text-slate-900 font-headline font-bold text-xl text-center">Ticket Not Found</Text>
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
