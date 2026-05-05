import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, History, Car, User } from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: History, label: 'Sessions', path: '/sessions' },
  { icon: Car, label: 'Check-in', path: '/manual-reservation' },
  { icon: User, label: 'Account', path: '/profile' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t border-slate-100 rounded-t-[32px] shadow-[0_-4px_20px_-2px_rgba(0,0,0,0.05)]">
      <div className="max-w-2xl mx-auto flex justify-around items-center px-4 pb-8 pt-3">
        {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center transition-all scale-95 active:scale-90",
              isActive ? "text-primary font-bold" : "text-slate-400 hover:text-primary"
            )}
          >
            <div className="p-2 rounded-xl mb-1 transition-colors">
              <item.icon className={cn("w-6 h-6", isActive ? "text-primary fill-primary/20" : "text-slate-400")} />
            </div>
            <span className="font-headline text-[10px] font-bold uppercase tracking-wider">
              {item.label}
            </span>
          </Link>
        );
      })}
      </div>
    </nav>
  );
}
