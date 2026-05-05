import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Settings as SettingsIcon, 
  Building2, 
  Bell, 
  Users, 
  Shield, 
  Monitor,
  Sun,
  Moon,
  ChevronRight,
  LogOut,
  HelpCircle,
  Info
} from 'lucide-react';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { SettingsSkeleton } from '../components/Skeleton';
import BottomSheet from '../components/BottomSheet';

interface SettingItem {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  path?: string;
  onClick?: () => void;
}

interface SettingGroup {
  title: string;
  items: SettingItem[];
}

export default function Settings() {

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isThemeSheetOpen, setIsThemeSheetOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'system' | 'light' | 'dark'>('system');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const themeOptions = [
    { id: 'system', title: 'System Default', icon: Monitor, color: 'bg-slate-100 text-slate-600' },
    { id: 'light', title: 'Light Mode', icon: Sun, color: 'bg-amber-50 text-amber-600' },
    { id: 'dark', title: 'Dark Mode', icon: Moon, color: 'bg-slate-900 text-white' }
  ];

  const settingsGroups: SettingGroup[] = [
    {
      title: "General Configuration",
      items: [
        {
          id: "facility",
          title: "Facility Configuration",
          subtitle: "Terminal capacity, rates & rules",
          icon: Building2,
          color: "bg-blue-50 text-blue-600",
          path: "/settings/facility"
        },
        {
          id: "notifications",
          title: "Notification Preferences",
          subtitle: "Alerts, reports & system updates",
          icon: Bell,
          color: "bg-amber-50 text-amber-600",
          path: "/settings/notifications"
        }
      ]
    },
    {
      title: "Appearance",
      items: [
        {
          id: "theme",
          title: "Display Theme",
          subtitle: currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1),
          icon: currentTheme === 'light' ? Sun : currentTheme === 'dark' ? Moon : Monitor,
          color: currentTheme === 'light' ? "bg-amber-50 text-amber-600" : currentTheme === 'dark' ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600",
          onClick: () => setIsThemeSheetOpen(true)
        }
      ]
    },
    {
      title: "Administration",
      items: [
        {
          id: "staff",
          title: "Staff Management",
          subtitle: "Manage roles & permissions",
          icon: Users,
          color: "bg-emerald-50 text-emerald-600",
          path: "/settings/staff"
        },
        {
          id: "security",
          title: "Account Security",
          subtitle: "Password, 2FA & active sessions",
          icon: Shield,
          color: "bg-indigo-50 text-indigo-600",
          path: "/settings/security"
        }
      ]
    },
    {
      title: "Support & Legal",
      items: [
        {
          id: "help",
          title: "Help Center",
          subtitle: "FAQs & technical support",
          icon: HelpCircle,
          color: "bg-slate-100 text-slate-600",
          path: "#"
        },
        {
          id: "about",
          title: "About ParkAddis",
          subtitle: "Version 2.4.1-STABLE",
          icon: Info,
          color: "bg-slate-100 text-slate-600",
          path: "#"
        }
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-grow flex flex-col pb-32"
    >
      {isLoading ? (
        <SettingsSkeleton />
      ) : (
        <main className="max-w-7xl mx-auto px-6 pt-6 w-full">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => navigate('/profile')}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <h2 className="text-xl font-headline font-bold text-slate-900 tracking-tight">Settings</h2>
          </div>

          {/* Settings List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {settingsGroups.map((group, idx) => (
              <div key={idx}>
                <h3 className="text-[10px] font-headline font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">
                  {group.title}
                </h3>
                <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100">
                  {group.items.map((item, itemIdx) => (
                    <React.Fragment key={item.id}>
                      {item.path ? (
                        <Link 
                          to={item.path}
                          className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors duration-200 group"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center`}>
                              <item.icon className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-bold text-slate-900">{item.title}</p>
                              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{item.subtitle}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                        </Link>
                      ) : (
                        <button 
                          onClick={item.onClick}
                          className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors duration-200 group"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center`}>
                              <item.icon className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-bold text-slate-900">{item.title}</p>
                              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{item.subtitle}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                        </button>
                      )}
                      {itemIdx < group.items.length - 1 && (
                        <div className="h-[1px] bg-slate-100 mx-5" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}

            {/* Logout Section */}
            <div className="pt-4 md:col-span-2">
              <button className="w-full flex items-center justify-between p-6 bg-red-50 rounded-[32px] border border-red-100 hover:bg-red-100 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-red-600 shadow-sm">
                    <LogOut className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-red-600">Logout Session</p>
                    <p className="text-[10px] text-red-600/60 font-medium uppercase tracking-wide">Securely end your session</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-red-600/40 group-hover:text-red-600 transition-colors" />
              </button>
            </div>
          </div>
        </main>
      )}

      <BottomSheet
        isOpen={isThemeSheetOpen}
        onClose={() => setIsThemeSheetOpen(false)}
        title="Display Theme"
        subtitle="Choose your preferred appearance"
      >
        <div className="space-y-3">
          {themeOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                setCurrentTheme(option.id as any);
                setIsThemeSheetOpen(false);
              }}
              className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all duration-200 ${
                currentTheme === option.id 
                  ? 'bg-primary/5 border-primary/20 ring-1 ring-primary/20' 
                  : 'bg-white border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${option.color} flex items-center justify-center shadow-sm`}>
                  <option.icon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className={`text-sm font-bold ${currentTheme === option.id ? 'text-primary' : 'text-slate-900'}`}>
                    {option.title}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                    {option.id === 'system' ? 'Follow device settings' : `Use ${option.id} mode`}
                  </p>
                </div>
              </div>
              {currentTheme === option.id && (
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </button>
          ))}
        </div>
      </BottomSheet>

      <BottomNav />
    </motion.div>
  );
}
