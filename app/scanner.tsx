import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  X,
  Zap,
  ZapOff,
  Keyboard,
  Camera,
  AlertCircle,
  Loader2,
  CheckCircle2
} from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing
} from 'react-native-reanimated';

import { apiFetch } from '../lib/api';

export default function Scanner() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [torch, setTorch] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Animation values
  const scanLineY = useSharedValue(0);

  useEffect(() => {
    if (!isScanning) {
      scanLineY.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 2500, easing: Easing.linear }),
          withTiming(0, { duration: 2500, easing: Easing.linear })
        ),
        -1,
        true
      );
    }
  }, [isScanning]);

  const animatedLineStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: scanLineY.value * 256 }]
    };
  });

  const handleScan = async (data: string) => {
    if (isScanning || !data) return;
    
    // Extract token if it's a URL (ParkAddis standard)
    let qrToken = data;
    if (data.includes('/r/') || data.includes('token=')) {
      try {
        const parts = data.split('/');
        qrToken = parts[parts.length - 1].split('?')[0];
      } catch (e) {
        qrToken = data;
      }
    }

    setIsScanning(true);
    setError(null);
    setScanProgress(30);

    const interval = setInterval(() => {
      setScanProgress(p => Math.min(p + 10, 95));
    }, 150);

    try {
      const result = await apiFetch<any>('/reservation/validate', {
        method: 'POST',
        body: JSON.stringify({ qrToken }),
      });

      clearInterval(interval);
      
      if (result.ok && result.data) {
        setScanProgress(100);
        
        // Handle potential wrapped response
        const reservation = result.data.data || result.data.reservation || result.data.reservedSpot || result.data;
        
        setTimeout(() => {
          if (reservation.status === 'ACTIVE') {
            router.push({
              pathname: '/success',
              params: { reservationId: reservation.id }
            });
          } else if (reservation.status === 'COMPLETED') {
            router.push({
              pathname: '/checkout-success',
              params: { reservationId: reservation.id }
            });
          } else {
            router.push('/dashboard');
          }
        }, 600);
      } else {
        setIsScanning(false);
        setError(result.error || 'This QR code is not valid or has expired.');
      }
    } catch (err: any) {
      clearInterval(interval);
      setIsScanning(false);
      setError('Connection failed. Please check your network.');
    }
  };

  const handleBarCodeScanned = (result: { data: string }) => {
    if (isScanning || !result.data) return;
    handleScan(result.data);
  };

  if (!permission) {
    return <View className="flex-1 bg-white" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-8">
        <AlertCircle size={64} color="#EF4444" />
        <Text className="text-slate-900 text-xl font-headline font-bold mt-6 text-center">
          Camera Access Required
        </Text>
        <Text className="text-slate-500 text-center mt-2 mb-8">
          We need your permission to use the camera for scanning parking tickets.
        </Text>
        <TouchableOpacity onPress={requestPermission} className="bg-primary px-8 py-4 rounded-2xl">
          <Text className="text-white font-bold">Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} className="mt-6">
          <Text className="text-slate-400 font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <SafeAreaView edges={['top']} className="px-6 pb-6 flex-row justify-between items-center z-10 w-full" style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}>
        <View>
          <Text className="text-xl font-headline font-bold text-slate-900 tracking-tight">QR Scanner</Text>
        </View>
        <TouchableOpacity 
          onPress={() => router.push('/dashboard')}
          className="p-3 bg-slate-100 rounded-2xl active:bg-slate-200"
        >
          <X size={24} color="#475569" />
        </TouchableOpacity>
      </SafeAreaView>

      <View className="flex-1 items-center justify-center px-6">
        {/* Scanner Viewfinder Box */}
        <View className="w-full aspect-square max-w-sm rounded-[48px] overflow-hidden border-4 border-slate-100 bg-slate-50 relative shadow-2xl items-center justify-center">
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            onBarcodeScanned={isScanning ? undefined : handleBarCodeScanned}
            enableTorch={torch}
          />
          
          <View className="absolute inset-0 bg-black/5" />
          
          <View className="absolute inset-0 items-center justify-center">
            <View className="w-64 h-64 relative">
              {/* Corners */}
              <View className="absolute top-0 left-0 w-14 h-14 border-t-4 border-l-4 border-primary rounded-tl-3xl" />
              <View className="absolute top-0 right-0 w-14 h-14 border-t-4 border-r-4 border-primary rounded-tr-3xl" />
              <View className="absolute bottom-0 left-0 w-14 h-14 border-b-4 border-l-4 border-primary rounded-bl-3xl" />
              <View className="absolute bottom-0 right-0 w-14 h-14 border-b-4 border-r-4 border-primary rounded-br-3xl" />
              
              {/* Scan Line */}
              {!isScanning && (
                <Animated.View style={[{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, backgroundColor: '#064e3b', borderRadius: 2, shadowColor: '#10b981', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 10, zIndex: 10 }, animatedLineStyle]} />
              )}
            </View>
          </View>

          {/* Scanner Info Overlay */}
          <View className="absolute bottom-10 left-0 right-0 items-center justify-center">
            <View className="bg-white/90 px-6 py-2.5 rounded-full border border-slate-200 shadow-sm">
              <Text className="text-[10px] font-bold text-slate-800 uppercase tracking-[0.3em] text-center">Auto-detecting QR Code</Text>
            </View>
          </View>

          {/* Scanning Progress & Status Overlay */}
          {isScanning && (
            <View className="absolute inset-0 bg-primary/30 items-center justify-center z-20" style={{ backgroundColor: 'rgba(6, 78, 59, 0.6)' }}>
              {scanProgress < 100 ? (
                <View className="items-center">
                  <Text className="text-white font-bold text-sm uppercase tracking-widest mt-4 mb-4">Processing...</Text>
                  <View className="w-32 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <View className="h-full bg-white transition-all" style={{ width: `${scanProgress}%` }} />
                  </View>
                </View>
              ) : (
                <View className="items-center justify-center">
                  <CheckCircle2 size={64} color="white" className="mb-2" />
                  <Text className="text-white font-bold text-sm uppercase tracking-widest mt-2">Success!</Text>
                </View>
              )}
            </View>
          )}

          {error && (
            <View className="absolute inset-0 bg-red-600/90 items-center justify-center z-20 p-8">
              <AlertCircle size={48} color="white" className="mb-4" />
              <Text className="text-white font-headline font-bold text-lg text-center">{error}</Text>
              <TouchableOpacity 
                onPress={() => setError(null)}
                className="mt-6 bg-white px-6 py-2.5 rounded-full"
              >
                <Text className="text-red-600 font-bold uppercase text-[10px] tracking-widest">Try Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Controls */}
        <View className="flex-row justify-between mt-12 w-full max-w-sm px-4">
          <TouchableOpacity 
            onPress={() => setTorch(!torch)}
            className="items-center gap-3 active:opacity-80"
          >
            <View className={`w-16 h-16 rounded-2xl border ${torch ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-100'} items-center justify-center shadow-sm`}>
              {torch ? <ZapOff size={28} color="#d97706" /> : <Zap size={28} color="#94a3b8" />}
            </View>
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Flash</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => handleScan('MOCK_TEST_TOKEN')} // For manual testing without camera
            disabled={isScanning}
            className="items-center gap-3 active:scale-95 transition-all"
          >
            <View className="w-20 h-20 rounded-3xl bg-primary items-center justify-center shadow-2xl">
              <Camera size={32} color="white" />
            </View>
            <Text className="text-[10px] font-bold text-primary uppercase tracking-widest">Scan</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/manual-reservation')}
            className="items-center gap-3 active:opacity-80"
          >
            <View className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 items-center justify-center shadow-sm">
              <Keyboard size={28} color="#94a3b8" />
            </View>
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manual</Text>
          </TouchableOpacity>
        </View>
      </View>

      <SafeAreaView edges={['bottom']} className="px-6 pb-2 items-center">
        <Text className="text-slate-300 text-[10px] font-bold uppercase tracking-widest text-center">ParkAddis Terminal B • Secure Entry</Text>
      </SafeAreaView>
    </View>
  );
}
