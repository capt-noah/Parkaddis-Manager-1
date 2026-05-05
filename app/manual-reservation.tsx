import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Car, CreditCard, Banknote, Clock, Hash, CheckCircle, MapPin, ChevronDown, AlertCircle } from 'lucide-react-native';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { apiFetch } from '../lib/api';

interface ParkingSpot {
  id: string;
  pricePerHour: string;
  availableSlots: number;
}

interface ParkingLocation {
  id: string;
  name: string;
  address: string;
}

export default function ManualReservation() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [paymentType, setPaymentType] = useState<'cash' | 'transfer'>('cash');
  const [vehicleId, setVehicleId] = useState('');
  const [plateNote, setPlateNote] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('60');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingSpots, setIsFetchingSpots] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [spots, setSpots] = useState<{ location: ParkingLocation; spot: ParkingSpot } | null>(null);
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);

  const onSelectPayment = useCallback((type: 'cash' | 'transfer') => {
    setPaymentType(type);
  }, []);

  // Fetch available parking spots on mount
  useEffect(() => {
    const loadSpots = async () => {
      setIsFetchingSpots(true);
      const result = await apiFetch<any>('/parking?distance=All');
      if (result.ok && result.data) {
        const locations = Array.isArray(result.data)
          ? result.data
          : (result.data as any).data || (result.data as any).locations || [];
        if (locations.length > 0) {
          // Fetch detail of first location to get spotId
          const detailResult = await apiFetch<any>('/parking/location', {
            method: 'POST',
            body: JSON.stringify({ id: locations[0].id }),
          });
          if (detailResult.ok && detailResult.data) {
            setSpots(detailResult.data);
            setSelectedSpotId(detailResult.data.spot?.id || null);
          }
        }
      }
      setIsFetchingSpots(false);
    };
    loadSpots();
  }, []);

  const handleSubmit = async () => {
    if (!vehicleId.trim()) {
      setError('Vehicle ID is required to create a reservation.');
      return;
    }
    if (!selectedSpotId) {
      setError('No parking spot available. Please try again.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const startTime = new Date().toISOString();
    const endTime = new Date(Date.now() + parseInt(durationMinutes || '60', 10) * 60 * 1000).toISOString();

    const result = await apiFetch<any>('/reservation', {
      method: 'POST',
      body: JSON.stringify({
        spotId: selectedSpotId,
        vehicleId: vehicleId.trim(),
        startTime,
        endTime,
      }),
    });

    setIsLoading(false);

    if (result.ok && result.data) {
      const reservation = result.data.reservedSpot || result.data.data || result.data;
      router.push({
        pathname: '/success',
        params: { reservationId: reservation.id },
      });
    } else {
      setError(result.error || 'Failed to create reservation. Check the Vehicle ID and try again.');
    }
  };

  const iconColor = isDark ? '#64748b' : '#94a3b8';
  const placeholderColor = isDark ? '#475569' : '#cbd5e1';

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-slate-900" edges={['top']}>
      <TopBar />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-6 mt-4">
            <Text className="text-2xl font-headline font-bold tracking-tight text-primary dark:text-emerald-500">
              Manual Check-In
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 font-medium mt-1">
              Register a walk-in vehicle directly
            </Text>
          </View>

          {/* Spot Info Banner */}
          {isFetchingSpots ? (
            <View className="bg-white dark:bg-slate-800 rounded-3xl p-4 mb-4 border border-slate-100 dark:border-slate-700 flex-row items-center gap-3">
              <ActivityIndicator size="small" color="#064e3b" />
              <Text className="text-slate-500 dark:text-slate-400 text-sm font-medium">Loading available spots...</Text>
            </View>
          ) : spots ? (
            <View className="bg-primary/5 dark:bg-emerald-900/20 rounded-3xl p-4 mb-4 border border-primary/10 dark:border-emerald-800/30 flex-row items-center gap-3">
              <View className="w-10 h-10 bg-primary rounded-xl items-center justify-center">
                <MapPin size={18} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold text-primary dark:text-emerald-500 uppercase tracking-wider">
                  Assigning to: {spots.location?.name || 'Parking Area'}
                </Text>
                <Text className="text-[10px] text-slate-400 font-medium mt-0.5">
                  {spots.spot?.availableSlots ?? '–'} slots available · {spots.spot?.pricePerHour ?? '–'} ETB/hr
                </Text>
              </View>
            </View>
          ) : (
            <View className="bg-amber-50 dark:bg-amber-900/20 rounded-3xl p-4 mb-4 border border-amber-100 dark:border-amber-800/30 flex-row items-center gap-3">
              <AlertCircle size={20} color="#d97706" />
              <Text className="text-amber-700 dark:text-amber-400 text-xs font-bold flex-1">
                Could not load parking spots. Check connection.
              </Text>
            </View>
          )}

          {/* Form Card */}
          <View className="bg-white dark:bg-slate-800 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden w-full">
            <View className="p-8 border-b border-dashed border-slate-100 dark:border-slate-700">
              <View className="gap-6 w-full">

                {/* Vehicle ID */}
                <View>
                  <Text className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-1">
                    Vehicle ID
                  </Text>
                  <View className="relative justify-center">
                    <View className="absolute left-4 z-10">
                      <Hash size={20} color={iconColor} />
                    </View>
                    <TextInput
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border-0 rounded-xl text-slate-900 dark:text-white font-semibold"
                      placeholder="Customer's vehicle UUID"
                      placeholderTextColor={placeholderColor}
                      autoCapitalize="none"
                      value={vehicleId}
                      onChangeText={setVehicleId}
                    />
                  </View>
                  <Text className="text-[10px] text-slate-400 mt-1 px-1">
                    Found in customer profile under "My Vehicles"
                  </Text>
                </View>

                {/* Plate Note */}
                <View>
                  <Text className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-1">
                    Plate Number (Note)
                  </Text>
                  <View className="relative justify-center">
                    <View className="absolute left-4 z-10">
                      <Car size={20} color={iconColor} />
                    </View>
                    <TextInput
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border-0 rounded-xl text-slate-900 dark:text-white font-semibold"
                      placeholder="e.g. AA-12345 (optional)"
                      placeholderTextColor={placeholderColor}
                      autoCapitalize="characters"
                      value={plateNote}
                      onChangeText={setPlateNote}
                    />
                  </View>
                </View>
              </View>

              {/* Ticket Notch */}
              <View className="absolute -bottom-3 -left-3 w-6 h-6 bg-background dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-700" style={{ borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 0, borderLeftWidth: 0, transform: [{ rotate: '45deg' }] }} />
              <View className="absolute -bottom-3 -right-3 w-6 h-6 bg-background dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-700" style={{ borderLeftWidth: 1, borderTopWidth: 1, borderBottomWidth: 0, borderRightWidth: 0, transform: [{ rotate: '-45deg' }] }} />
            </View>

            <View className="p-8 gap-8 w-full">
              <View className="gap-6 w-full">

                {/* Duration */}
                <View>
                  <Text className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-1">
                    Estimated Duration (minutes)
                  </Text>
                  <View className="relative justify-center">
                    <View className="absolute left-4 z-10">
                      <Clock size={20} color={iconColor} />
                    </View>
                    <TextInput
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border-0 rounded-xl text-slate-900 dark:text-white font-semibold"
                      placeholder="60"
                      keyboardType="numeric"
                      placeholderTextColor={placeholderColor}
                      value={durationMinutes}
                      onChangeText={setDurationMinutes}
                    />
                  </View>
                </View>

                {/* Payment Type */}
                <View>
                  <Text className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-1">
                    Payment Type
                  </Text>
                  <View className="flex-row gap-3 w-full">
                    <TouchableOpacity
                      onPress={() => onSelectPayment('cash')}
                      activeOpacity={0.7}
                      className={`flex-1 flex-row items-center justify-center gap-2 py-4 rounded-xl shadow-sm ${
                        paymentType === 'cash' ? 'bg-primary dark:bg-emerald-800' : 'bg-slate-100 dark:bg-slate-900'
                      }`}
                    >
                      <Banknote size={16} color={paymentType === 'cash' ? 'white' : '#64748b'} />
                      <Text className={`font-bold text-sm ${paymentType === 'cash' ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                        Cash
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => onSelectPayment('transfer')}
                      activeOpacity={0.7}
                      className={`flex-1 flex-row items-center justify-center gap-2 py-4 rounded-xl shadow-sm ${
                        paymentType === 'transfer' ? 'bg-primary dark:bg-emerald-800' : 'bg-slate-100 dark:bg-slate-900'
                      }`}
                    >
                      <CreditCard size={16} color={paymentType === 'transfer' ? 'white' : '#64748b'} />
                      <Text className={`font-bold text-sm ${paymentType === 'transfer' ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                        Transfer
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {error && (
                <View className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30">
                  <Text className="text-red-600 dark:text-red-400 text-xs font-bold">{error}</Text>
                </View>
              )}

              <View className="pt-4">
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={isLoading || !vehicleId.trim() || !selectedSpotId}
                  className={`w-full py-5 rounded-2xl shadow-lg shadow-primary/20 flex-row items-center justify-center gap-3 ${
                    isLoading || !vehicleId.trim() || !selectedSpotId
                      ? 'bg-slate-200 dark:bg-slate-700'
                      : 'bg-primary dark:bg-emerald-800 active:bg-emerald-900'
                  }`}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <CheckCircle size={24} color="white" />
                  )}
                  <Text className="text-white font-headline font-bold text-lg">
                    {isLoading ? 'Processing...' : 'Check-In Vehicle'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomNav />
    </SafeAreaView>
  );
}
