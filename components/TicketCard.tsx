import React from 'react';
import { View, Text } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface TicketCardProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  status?: 'active' | 'completed';
  badge?: string;
  children?: React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export default function TicketCard({
  title,
  subtitle,
  icon: Icon,
  status,
  badge,
  children,
  className = '',
  headerClassName = '',
}: TicketCardProps) {
  return (
    <View className={`bg-white rounded-[24px] border border-slate-100 overflow-hidden ${className}`}>
      <View className={`p-5 flex-row justify-between items-start ${headerClassName}`}>
        <View className="flex-row items-start gap-3">
          {Icon && (
            <View className="bg-primary/5 p-2 rounded-xl">
              <Icon size={20} color="#064e3b" />
            </View>
          )}
          <View>
            <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">{subtitle}</Text>
            <Text className="text-lg font-headline font-bold text-slate-900">{title}</Text>
          </View>
        </View>
        {(status || badge) && (
          <View className={`px-2 py-1 rounded-full flex-row items-center gap-1 ${
            status === 'active' ? "bg-primary/10" : "bg-slate-100"
          }`}>
            {status === 'active' && <View className="w-1.5 h-1.5 bg-primary rounded-full" />}
            <Text className={`text-[10px] font-bold tracking-wider ${
              status === 'active' ? "text-primary" : "text-slate-500"
            }`}>
              {badge || (status === 'active' ? 'ACTIVE' : 'COMPLETED')}
            </Text>
          </View>
        )}
      </View>
      
      {/* Native Ticket Notch */}
      <View className="relative h-6 flex-row items-center overflow-hidden">
        {/* The dashed line */}
        <View className="w-full absolute" style={{ height: 1, borderWidth: 1, borderTopColor: 'transparent', borderBottomColor: '#f1f5f9', borderStyle: 'dashed' }} />
        {/* Left notch */}
        <View className="absolute w-6 h-6 bg-background rounded-full -left-3 top-0" />
        {/* Right notch */}
        <View className="absolute w-6 h-6 bg-background rounded-full -right-3 top-0" />
      </View>
      
      <View className="p-5">
        {children}
      </View>
    </View>
  );
}
