import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Shield, 
  Lock, 
  Smartphone, 
  Key, 
  History, 
  LogOut,
  ChevronRight,
  Save,
  AlertCircle
} from 'lucide-react';
import TopBar from '../../components/TopBar';
import BottomNav from '../../components/BottomNav';

export default function AccountSecurity() {
  const navigate = useNavigate();
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  const sessions = [
    { id: 1, device: "MacBook Pro 16\"", location: "Addis Ababa, ET", time: "Active Now", icon: Smartphone, current: true },
    { id: 2, device: "iPhone 15 Pro", location: "Bole District, ET", time: "2 hours ago", icon: Smartphone, current: false },
    { id: 3, device: "Windows Desktop", location: "Unknown Location", time: "Oct 22, 2023", icon: Smartphone, current: false }
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
              <h2 className="text-lg font-headline font-bold text-slate-900 tracking-tight">Security</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ACCOUNT SECURITY DETAIL</p>
            </div>
          </div>
        </div>

        {/* Authentication Section */}
        <div className="space-y-8">
          <section>
            <h3 className="text-[10px] font-headline font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">Authentication</h3>
            <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100">
              <button className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900">Change Password</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Last updated 3 months ago</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
              </button>
              <div className="h-[1px] bg-slate-100 mx-6" />
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900">Two-Factor Auth (2FA)</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Secure login with mobile app</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                  className={`w-12 h-6 rounded-full relative p-1 transition-colors duration-300 ${is2FAEnabled ? 'bg-primary' : 'bg-slate-200'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 ${is2FAEnabled ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </section>

          {/* Active Sessions Section */}
          <section>
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-[10px] font-headline font-extrabold uppercase tracking-[0.2em] text-slate-400">Active Sessions</h3>
              <button className="text-[10px] font-bold uppercase tracking-widest text-red-600 hover:underline">Sign Out All</button>
            </div>
            <div className="space-y-3">
              {sessions.map((session) => (
                <div key={session.id} className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${session.current ? 'bg-primary/10 text-primary' : 'bg-slate-50 text-slate-400'} flex items-center justify-center`}>
                      <session.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{session.device}</h4>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{session.location} • {session.time}</p>
                    </div>
                  </div>
                  {session.current ? (
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  ) : (
                    <button className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                      <LogOut className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Security Log */}
          <section>
            <h3 className="text-[10px] font-headline font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">Security Audit Log</h3>
            <div className="bg-slate-50 rounded-[32px] p-6 border border-slate-100">
              <div className="flex gap-4">
                <History className="w-5 h-5 text-slate-400 shrink-0" />
                <div className="space-y-4">
                  {[
                    { action: "Password updated successfully", time: "3 months ago" },
                    { action: "New login from MacBook Pro 16\"", time: "Oct 24, 2023" },
                    { action: "2FA enabled for account", time: "Oct 20, 2023" }
                  ].map((log, i) => (
                    <div key={i} className="relative pl-4 border-l border-slate-200">
                      <div className="absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-full bg-slate-300" />
                      <p className="text-xs font-bold text-slate-700">{log.action}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mt-0.5">{log.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <BottomNav />
    </motion.div>
  );
}
