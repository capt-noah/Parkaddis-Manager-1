import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  Search, 
  Plus, 
  MoreVertical,
  CheckCircle2,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';

const staff = [
  { id: 1, name: 'Abebe Bikila', role: 'Admin', status: 'active', email: 'abebe@parkaddis.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  { id: 2, name: 'Sara Kebede', role: 'Operator', status: 'active', email: 'sara@parkaddis.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  { id: 3, name: 'Dawit Tadesse', role: 'Operator', status: 'inactive', email: 'dawit@parkaddis.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
];

export default function StaffManagement() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = staff.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const iconColor = isDark ? "#64748b" : "#475569";

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-slate-900" edges={['top']}>
      <ScrollView
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header — matches settings page style */}
        <View className="flex-row items-center gap-4 mb-8">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="p-2 -mx-2 rounded-full"
          >
            <ChevronLeft size={24} color={iconColor} />
          </TouchableOpacity>
          <Text className="text-xl font-headline font-bold text-slate-900 dark:text-white tracking-tight">Staff Management</Text>
        </View>

        {/* Search & Add */}
        <View className="flex-row gap-3 mb-8">
          <View className="flex-1 flex-row items-center bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-4 py-3 shadow-sm">
            <Search size={20} color={isDark ? "#64748b" : "#94A3B8"} />
            <TextInput 
              className="flex-1 ml-3 text-slate-900 dark:text-white font-medium"
              placeholder="Search staff..."
              placeholderTextColor={isDark ? "#475569" : "#94A3B8"}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity className="bg-primary dark:bg-emerald-800 w-14 h-14 rounded-2xl items-center justify-center shadow-lg shadow-primary/20">
            <Plus size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Staff List */}
        <View className="gap-4">
          {filtered.map((person) => (
            <View key={person.id} className="bg-white dark:bg-slate-800 p-5 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-4">
                  <View className="w-12 h-12 rounded-2xl overflow-hidden">
                    <Image source={{ uri: person.avatar }} className="w-full h-full" />
                  </View>
                  <View>
                    <Text className="text-slate-900 dark:text-white font-bold">{person.name}</Text>
                    <Text className="text-slate-400 dark:text-slate-500 text-xs">{person.email}</Text>
                  </View>
                </View>
                <TouchableOpacity>
                  <MoreVertical size={20} color={isDark ? "#64748b" : "#94A3B8"} />
                </TouchableOpacity>
              </View>
              
              <View className="flex-row items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700">
                <View className="flex-row items-center gap-2">
                  <View className="bg-primary/5 dark:bg-primary/20 px-3 py-1 rounded-full border border-primary/10 dark:border-primary/40">
                    <Text className="text-primary dark:text-emerald-500 text-[10px] font-bold uppercase tracking-wider">{person.role}</Text>
                  </View>
                  <View className={`px-3 py-1 rounded-full border flex-row items-center gap-1 ${
                    person.status === 'active' 
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/40' 
                      : 'bg-slate-50 dark:bg-slate-700 border-slate-100 dark:border-slate-600'
                  }`}>
                    <View className={`w-1.5 h-1.5 rounded-full ${person.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400 dark:bg-slate-500'}`} />
                    <Text className={`text-[10px] font-bold uppercase tracking-wider ${
                      person.status === 'active' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
                    }`}>{person.status}</Text>
                  </View>
                </View>
                <TouchableOpacity>
                  <Text className="text-primary dark:text-emerald-500 text-xs font-bold">Edit Access</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
