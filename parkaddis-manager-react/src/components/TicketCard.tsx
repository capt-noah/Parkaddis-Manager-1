import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

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
  className,
  headerClassName,
}: TicketCardProps) {
  return (
    <div className={cn("bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden", className)}>
      <div className={cn("p-5 flex justify-between items-start", headerClassName)}>
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="bg-primary/5 p-2 rounded-xl">
              <Icon className="w-5 h-5 text-primary" />
            </div>
          )}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">{subtitle}</p>
            <p className="text-lg font-headline font-bold text-slate-900">{title}</p>
          </div>
        </div>
        {(status || badge) && (
          <div className={cn(
            "px-2 py-1 rounded-full flex items-center gap-1",
            status === 'active' ? "bg-primary/10" : "bg-slate-100"
          )}>
            {status === 'active' && <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />}
            <span className={cn(
              "text-[10px] font-bold tracking-wider",
              status === 'active' ? "text-primary" : "text-slate-500"
            )}>
              {badge || (status === 'active' ? 'ACTIVE' : 'COMPLETED')}
            </span>
          </div>
        )}
      </div>
      
      <div className="ticket-notch mx-5" />
      
      <div className="p-5">
        {children}
      </div>
    </div>
  );
}
