import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Bell, 
  Mail, 
  Smartphone, 
  MessageSquare,
  AlertTriangle,
  BarChart3,
  ShieldAlert,
  Save
} from 'lucide-react';
import TopBar from '../../components/TopBar';
import BottomNav from '../../components/BottomNav';

export default function NotificationPrefs() {
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState({
    push: true,
    email: true,
    sms: false,
    occupancy: true,
    revenue: true,
    security: true,
    maintenance: false
  });

  const togglePref = (key: keyof typeof prefs) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const notificationTypes = [
    {
      id: "occupancy",
      title: "Occupancy Alerts",
      subtitle: "Notify when terminal reaches 90% capacity",
      icon: AlertTriangle,
      color: "bg-amber-50 text-amber-600"
    },
    {
      id: "revenue",
      title: "Revenue Milestones",
      subtitle: "Daily and weekly performance summaries",
      icon: BarChart3,
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      id: "security",
      title: "Security Incidents",
      subtitle: "Unauthorized access or system tampering",
      icon: ShieldAlert,
      color: "bg-red-50 text-red-600"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-grow flex flex-col pb-32"
    >
      <main className="max-w-2xl mx-auto px-6 pt-4 w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/settings')}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-slate-600" />
            </button>
            <div>
              <h2 className="text-lg font-headline font-bold text-slate-900 tracking-tight">Notifications</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PREFERENCES DETAIL</p>
            </div>
          </div>
        </div>

        {/* Channels Section */}
        <div className="space-y-8">
          <section>
            <h3 className="text-[10px] font-headline font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">Delivery Channels</h3>
            <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100">
              {[
                { id: 'push', title: 'Push Notifications', icon: Smartphone, color: 'text-blue-600' },
                { id: 'email', title: 'Email Reports', icon: Mail, color: 'text-emerald-600' },
                { id: 'sms', title: 'SMS Critical Alerts', icon: MessageSquare, color: 'text-amber-600' }
              ].map((channel, i) => (
                <React.Fragment key={channel.id}>
                  <div className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center ${channel.color}`}>
                        <channel.icon className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-900">{channel.title}</p>
                    </div>
                    <button 
                      onClick={() => togglePref(channel.id as keyof typeof prefs)}
                      className={`w-12 h-6 rounded-full relative p-1 transition-colors duration-300 ${prefs[channel.id as keyof typeof prefs] ? 'bg-primary' : 'bg-slate-200'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 ${prefs[channel.id as keyof typeof prefs] ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                  {i < 2 && <div className="h-[1px] bg-slate-100 mx-6" />}
                </React.Fragment>
              ))}
            </div>
          </section>

          {/* Alert Types Section */}
          <section>
            <h3 className="text-[10px] font-headline font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">Alert Categories</h3>
            <div className="space-y-3">
              {notificationTypes.map((type, i) => (
                <div key={type.id} className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${type.color} flex items-center justify-center`}>
                      <type.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{type.title}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{type.subtitle}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => togglePref(type.id as keyof typeof prefs)}
                    className={`w-12 h-6 rounded-full relative p-1 transition-colors duration-300 ${prefs[type.id as keyof typeof prefs] ? 'bg-primary' : 'bg-slate-200'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 ${prefs[type.id as keyof typeof prefs] ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <BottomNav />
    </motion.div>
  );
}
