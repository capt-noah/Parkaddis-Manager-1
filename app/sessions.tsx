import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Car, Search, Clock, CreditCard, AlertCircle } from 'lucide-react-native';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

import { apiFetch } from '../lib/api';

interface Session {
  id: string;
  plateNumber: string;
  duration: string;
  accrued: string;
  status: 'RESERVED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID';
  startTime: string;
}

type SessionFilter = 'all' | 'active' | 'unpaid' | 'completed';

const FILTER_OPTIONS: SessionFilter[] = ['all', 'active', 'unpaid', 'completed'];

export default function Sessions() {
  const [activeFilter, setActiveFilter] = useState<SessionFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [allSessions, setAllSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isDark } = useTheme();

  const fetchData = async () => {
    setIsLoading(true);
    const result = await apiFetch<Session[]>('/reservation');
    
    if (result.ok && result.data) {
      // Handle potential wrapped response { data: [...] } or direct array [...]
      const sessions = Array.isArray(result.data) 
        ? result.data 
        : (result.data as any).data || (result.data as any).reservations || [];
        
      setAllSessions(Array.isArray(sessions) ? sessions : []);
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

  const filteredSessions = useMemo(() => {
    return allSessions.filter((session) => {
      let matchesFilter = false;
      if (activeFilter === 'all') {
        matchesFilter = true;
      } else if (activeFilter === 'active') {
        matchesFilter = session.status === 'ACTIVE';
      } else if (activeFilter === 'unpaid') {
        matchesFilter = session.paymentStatus === 'PENDING';
      } else if (activeFilter === 'completed') {
        matchesFilter = session.status === 'COMPLETED';
      }
      const plate = session.plateNumber || '';
      const matchesSearch = plate.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery, allSessions]);

  const selectFilter = useCallback((next: SessionFilter) => {
    setActiveFilter(next);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-slate-900" edges={['top']}>
      <TopBar />

      <View className="flex-1 w-full pt-2">
        <View className="px-6 mb-4">
          <View className="relative mb-4">
            <View className="absolute left-4 top-4 z-10">
              <Search size={20} color={isDark ? "#64748b" : "#94a3b8"} />
            </View>
            <TextInput
              placeholder="Search by plate number..."
              placeholderTextColor={isDark ? "#475569" : "#94a3b8"}
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium text-slate-900 dark:text-white"
            />
          </View>
        </View>

        <View className="pl-6 mb-6 w-full min-h-[44px]">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingRight: 24, alignItems: 'center' }}
          >
            {FILTER_OPTIONS.map((option) => {
              const selected = activeFilter === option;
              return (
                <TouchableOpacity
                  key={option}
                  onPress={() => selectFilter(option)}
                  activeOpacity={0.75}
                  className={`mr-2 px-5 py-2.5 rounded-full border ${
                    selected 
                      ? 'bg-primary dark:bg-emerald-800 border-transparent' 
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Text className={`text-[10px] font-bold uppercase tracking-widest ${
                    selected ? 'text-white' : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <ScrollView
          className="flex-1 px-6 w-full"
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              tintColor="#064e3b"
            />
          }
        >
          <View className="gap-6 w-full">
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <View
                  key={session.id}
                  className="bg-white dark:bg-slate-800 rounded-[32px] p-6 border border-slate-100 dark:border-slate-700 shadow-sm"
                >
                  <View className="flex-row justify-between items-start mb-6">
                    <View className="flex-row items-center gap-4">
                      <View className="w-12 h-12 bg-slate-50 dark:bg-slate-700 rounded-2xl items-center justify-center">
                        <Car size={24} color={isDark ? "#94a3b8" : "#94a3b8"} />
                      </View>
                      <View>
                        <Text className="text-lg font-headline font-bold text-slate-900 dark:text-white">{session.plateNumber}</Text>
                        <Text className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                          ID: {session.id.substring(0, 8)}
                        </Text>
                      </View>
                    </View>
                    <View className="items-end gap-2">
                      {session.status === 'ACTIVE' ? (
                        <View className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20">
                          <Text className="text-[10px] font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400">Active</Text>
                        </View>
                      ) : session.status === 'RESERVED' ? (
                        <View className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20">
                          <Text className="text-[10px] font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400">Reserved</Text>
                        </View>
                      ) : session.paymentStatus === 'PAID' ? (
                        <View className="px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20">
                          <Text className="text-[10px] font-bold tracking-widest uppercase text-primary dark:text-emerald-500">Completed</Text>
                        </View>
                      ) : (
                        <View className="px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/20">
                          <Text className="text-[10px] font-bold tracking-widest uppercase text-red-600 dark:text-red-400">Unpaid</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <View
                    className="flex-row justify-between pt-6 border-t border-dashed border-slate-200 dark:border-slate-700"
                  >
                    <View className="flex-row items-center gap-3">
                      <Clock size={16} color={isDark ? "#64748b" : "#94a3b8"} />
                      <View>
                        <Text className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Duration</Text>
                        <Text className="text-sm font-bold text-slate-900 dark:text-white">{session.duration || 'N/A'}</Text>
                      </View>
                    </View>
                    <View className="flex-row items-center gap-3 pr-4">
                      <CreditCard size={16} color={isDark ? "#64748b" : "#94a3b8"} />
                      <View>
                        <Text className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Accrued</Text>
                        <Text className="text-sm font-bold text-slate-900 dark:text-white font-mono">{session.accrued ? `ETB ${session.accrued}` : 'N/A'}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View className="w-full py-20 items-center justify-center">
                <View className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full items-center justify-center mb-4">
                  <AlertCircle size={40} color={isDark ? "#475569" : "#cbd5e1"} />
                </View>
                <Text className="text-lg font-headline font-bold text-slate-900 dark:text-white">No sessions found</Text>
                <Text className="text-sm text-slate-500 dark:text-slate-400 mt-1">Try adjusting your search or filter</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      <BottomNav />
    </SafeAreaView>
  );
}
