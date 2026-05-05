import React from 'react';
import { cn } from '../lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export default function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div className={cn("relative overflow-hidden bg-slate-200 rounded-md", className)} {...props}>
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="px-6 max-w-lg mx-auto w-full pt-2">
      <div className="mb-6">
        <Skeleton className="h-8 w-1/2" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <Skeleton className="col-span-2 h-24 rounded-[32px]" />
        <Skeleton className="col-span-2 h-40 rounded-[32px]" />
        <Skeleton className="h-24 rounded-[24px]" />
        <Skeleton className="h-24 rounded-[24px]" />
      </div>

      <div className="flex justify-between items-end mb-4">
        <div>
          <Skeleton className="h-6 w-24 mb-1" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>

      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i}>
            <Skeleton className="h-28 rounded-3xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SessionsSkeleton() {
  return (
    <div className="px-6 max-w-lg mx-auto w-full pt-2">
      <div className="mb-6">
        <Skeleton className="h-8 w-1/2" />
      </div>

      <div className="space-y-6">
        <Skeleton className="h-14 rounded-2xl" />
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-shrink-0">
              <Skeleton className="h-10 w-24 rounded-full" />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <Skeleton className="h-32 rounded-3xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="px-6 max-w-2xl mx-auto w-full pt-2">
      <div className="mb-12 flex flex-col items-center">
        <Skeleton className="w-40 h-40 rounded-full mb-10" />
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-5 w-64 mb-6" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <Skeleton className="h-24 rounded-3xl" />
        <Skeleton className="h-24 rounded-3xl" />
      </div>

      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-20 rounded-3xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SettingsSkeleton() {
  return (
    <div className="px-6 max-w-2xl mx-auto w-full pt-2">
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-8 w-32" />
      </div>

      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <Skeleton className="h-3 w-24 mb-4 px-2" />
            <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 p-1">
              <Skeleton className="h-20 w-full rounded-[28px] mb-1" />
              <Skeleton className="h-20 w-full rounded-[28px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ScannerSkeleton() {
  return (
    <div className="fixed inset-0 bg-slate-900 z-[100] flex flex-col">
      <div className="px-6 pt-12 pb-6 flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-32 bg-white/10" />
        </div>
        <Skeleton className="h-12 w-12 rounded-2xl bg-white/10" />
      </div>
      <div className="flex-grow flex items-center justify-center px-6">
        <Skeleton className="aspect-square w-full max-w-sm rounded-[48px] bg-white/5" />
      </div>
      <div className="grid grid-cols-3 gap-8 px-6 pb-24 w-full max-w-sm mx-auto">
        <Skeleton className="h-24 rounded-2xl bg-white/5" />
        <Skeleton className="h-24 rounded-3xl bg-white/10" />
        <Skeleton className="h-24 rounded-2xl bg-white/5" />
      </div>
    </div>
  );
}
