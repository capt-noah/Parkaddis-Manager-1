import React from 'react';
import { View } from 'react-native';
import { cn } from '../lib/utils';

/** Static placeholder blocks only — no Reanimated (avoids native crashes in Expo Go). */
interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className }: SkeletonProps) {
  return <View className={cn('bg-slate-200 dark:bg-slate-800 rounded-md', className)} />;
}

export function DashboardSkeleton() {
  return (
    <View className="flex-1 bg-background dark:bg-slate-900 px-6 w-full pt-4">
      {/* Welcome Area */}
      <View className="mb-8">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-60 mt-2" />
      </View>
      
      
      {/* Occupancy Card (Large) */}
      <Skeleton className="w-full h-44 rounded-[40px] mb-6" />
      
      {/* Two Stat Cards */}
      <View className="flex-row gap-4 mb-8">
        <Skeleton className="flex-1 h-32 rounded-[32px]" />
        <Skeleton className="flex-1 h-32 rounded-[32px]" />
      </View>
      
      {/* Recent Sessions list */}
      <View className="gap-4">
        <Skeleton className="h-6 w-32 mb-2 ml-2" />
        <Skeleton className="w-full h-24 rounded-[32px]" />
        <Skeleton className="w-full h-24 rounded-[32px]" />
      </View>
    </View>
  );
}

export function SessionsSkeleton() {
  return (
    <View className="flex-1 bg-background dark:bg-slate-900 px-6 w-full pt-4">
      {/* Header handled by Screen but search inside */}
      <Skeleton className="h-14 rounded-2xl mb-6 shadow-sm" />
      
      {/* Filter Chips */}
      <View className="flex-row gap-2 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-full" />
        ))}
      </View>
      
      {/* Session Cards */}
      <View className="gap-6">
        {[1, 2, 3].map((i) => (
          <View key={i} className="bg-white dark:bg-slate-800 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm">
            <View className="flex-row justify-between mb-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </View>
            <View className="flex-row justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export function ProfileSkeleton() {
  return (
    <View className="flex-1 bg-background dark:bg-slate-900 px-6 w-full pt-4">
      {/* Restored Profile Header Skeleton */}
      <View className="items-center mt-6 mb-10">
         <Skeleton className="w-28 h-28 rounded-[40px]" />
         <View className="items-center mt-4">
            <Skeleton className="h-8 w-40 mb-2" />
            <Skeleton className="h-4 w-32" />
         </View>
      </View>

      {/* Shift History Group */}
      <View className="mb-8">
        <Skeleton className="h-4 w-32 mb-4 ml-2" />
        <View className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
          <View className="flex-row items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-2xl" />
            <View className="flex-1">
              <Skeleton className="h-4 w-48 mb-2" />
              <Skeleton className="h-3 w-32" />
            </View>
          </View>
        </View>
      </View>

      {/* Station Reports Group */}
      <View className="mb-8">
        <Skeleton className="h-4 w-32 mb-4 ml-2" />
        <View className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
          <View className="flex-row items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-2xl" />
            <View className="flex-1">
              <Skeleton className="h-4 w-48 mb-2" />
              <Skeleton className="h-3 w-32" />
            </View>
          </View>
        </View>
      </View>

      {/* Settings Group */}
      <View>
        <Skeleton className="h-4 w-32 mb-4 ml-2" />
        <View className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm">
          {[1, 2].map((i) => (
            <View key={i} className="p-5 border-b border-slate-50 dark:border-slate-700">
              <View className="flex-row items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-2xl" />
                <View className="flex-1">
                  <Skeleton className="h-4 w-48 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export function SettingsSkeleton() {
  return (
    <View className="flex-1 bg-background dark:bg-slate-900 px-6 w-full pt-6">
      {/* Back + Header */}
      <View className="flex-row items-center gap-4 mb-6">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-8 w-32" />
      </View>
      
      {/* Settings Groups */}
      <View className="gap-8">
        {[1, 2, 3].map((i) => (
          <View key={i}>
            <Skeleton className="h-4 w-40 mb-4 ml-2" />
            <View className="bg-white dark:bg-slate-800 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm">
              {[1, 2].map((item) => (
                <View key={item} className="p-5 border-b last:border-0 border-slate-50 dark:border-slate-700 flex-row items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-2xl" />
                  <View className="flex-1">
                    <Skeleton className="h-4 w-48 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export function ScannerSkeleton() {
  return (
    <View className="absolute inset-0 bg-white z-[100] flex flex-col">
      <View className="px-6 pt-12 pb-6 flex-row justify-between items-center bg-slate-50">
        <Skeleton className="h-8 w-32 bg-slate-200" />
        <Skeleton className="h-12 w-12 rounded-2xl bg-slate-200" />
      </View>
      <View className="flex-1 items-center justify-center px-6">
        <Skeleton className="aspect-square w-full max-w-sm rounded-[48px] bg-slate-100" />
        <View className="flex-row justify-between mt-12 w-full max-w-sm px-4">
          <Skeleton className="w-16 h-16 rounded-2xl" />
          <Skeleton className="w-20 h-20 rounded-3xl" />
          <Skeleton className="w-16 h-16 rounded-2xl" />
        </View>
      </View>
    </View>
  );
}
