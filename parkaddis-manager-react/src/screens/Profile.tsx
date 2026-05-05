import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Clock, 
  BarChart3, 
  FileText, 
  ShieldCheck, 
  LogOut, 
  ChevronRight, 
  Download,
  Lock,
  Smartphone,
  Share,
  Settings
} from 'lucide-react';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import BottomSheet from '../components/BottomSheet';
import TicketCard from '../components/TicketCard';
import { ProfileSkeleton } from '../components/Skeleton';

export default function Profile() {
  const navigate = useNavigate();
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-grow flex flex-col pb-32"
    >
      <TopBar 
        profileIcon={<Settings className="w-5 h-5 text-slate-600" />}
        onProfileClick={() => navigate('/settings')}
      />
      
      {isLoading ? (
        <ProfileSkeleton />
      ) : (
        <main className="max-w-7xl mx-auto px-6 pt-2 w-full">
          {/* Profile Official Design */}
          <section className="mb-12 flex flex-col items-center text-center">
            <div className="relative">
              {/* Circular Profile Image with Green Border */}
              <div className="w-40 h-40 rounded-full border-[6px] border-emerald-900/10 p-1.5 bg-white shadow-xl">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-emerald-900">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Official Profile Badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                <div className="bg-emerald-900 text-white px-6 py-2 rounded-full shadow-lg border-2 border-white">
                  <span className="text-[10px] font-headline font-black uppercase tracking-[0.15em] whitespace-nowrap">
                    Official Profile
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-3xl font-headline font-bold text-slate-900 tracking-tight">ParkAddis Admin</h3>
              <p className="text-slate-500 font-medium text-lg mt-1">Bole District Terminal Manager</p>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="px-4 py-2 bg-slate-100 rounded-xl">
                <span className="text-xs font-mono font-bold text-slate-600 uppercase tracking-wider">ID: #PA-8821</span>
              </div>
              <div className="px-4 py-2 bg-slate-100 rounded-xl">
                <span className="text-xs font-headline font-bold text-slate-600 uppercase tracking-wider">Since 2021</span>
              </div>
            </div>
          </section>

          {/* Stats Bento Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Shift Efficiency</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-headline font-extrabold text-primary">98.4%</span>
                <span className="text-xs text-tertiary font-bold mb-1">↑ 2%</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total Revenue</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-headline font-extrabold text-primary">124k</span>
                <span className="text-[10px] text-slate-400 font-bold mb-1">ETB</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Avg. Occupancy</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-headline font-extrabold text-primary">76%</span>
                <span className="text-xs text-emerald-500 font-bold mb-1">Stable</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Active Staff</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-headline font-extrabold text-primary">12</span>
                <span className="text-xs text-slate-400 font-bold mb-1">On-duty</span>
              </div>
            </div>
          </div>

          {/* Lists Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div>
              <h3 className="text-[10px] font-headline font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">Shift History</h3>
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                <button className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors duration-200 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-900">Morning Shift • Terminal A</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Oct 24, 2023 • 08:00 - 16:00</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-headline font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">Station Reports</h3>
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                <button 
                  onClick={() => setIsReportsOpen(true)}
                  className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-tertiary/5 flex items-center justify-center text-tertiary">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-900">Daily Occupancy Summary</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">PDF Report • 2.4 MB</p>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-slate-400 group-hover:text-tertiary transition-colors" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-headline font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">Settings</h3>
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                <button 
                  onClick={() => setIsSecurityOpen(true)}
                  className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-900">Account Security</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">2FA Enabled • Password Changed</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                </button>
                <div className="h-[1px] bg-slate-100 mx-5" />
                <button className="w-full flex items-center justify-between p-5 hover:bg-red-50 transition-colors duration-200 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
                      <LogOut className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-red-600">Logout</p>
                      <p className="text-[10px] text-red-600/60 font-medium uppercase tracking-wide">Securely end your session</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Station Reports Bottom Sheet */}
      <BottomSheet
        isOpen={isReportsOpen}
        onClose={() => setIsReportsOpen(false)}
        title="Station Reports"
        subtitle="Access and audit station metrics"
      >
        <div className="space-y-4">
          {[
            { title: "Daily Occupancy Summary", size: "2.4 MB", type: "PDF", icon: BarChart3 },
            { title: "Staff Performance Audit", size: "1.8 MB", type: "PDF", icon: FileText },
          ].map((report, i) => (
            <div key={i} className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
              <div className="p-5 flex gap-4 items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <report.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-900">{report.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{report.size}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{report.type}</span>
                  </div>
                </div>
              </div>
              <div className="ticket-notch mx-4" />
              <div className="p-4 grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-white text-xs font-bold rounded-lg hover:bg-emerald-900 transition-all active:scale-95">
                  <Download className="w-4 h-4" /> Download PDF
                </button>
                <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white text-primary text-xs font-bold rounded-lg border border-primary/10 hover:bg-slate-100 transition-all active:scale-95">
                  <FileText className="w-4 h-4" /> View Report
                </button>
              </div>
            </div>
          ))}
        </div>
      </BottomSheet>

      {/* Account Security Bottom Sheet */}
      <BottomSheet
        isOpen={isSecurityOpen}
        onClose={() => setIsSecurityOpen(false)}
        title="Account Security"
        subtitle="Security & Access"
      >
        <div className="space-y-6">
          <div className="relative bg-slate-50 rounded-2xl overflow-hidden group hover:bg-white transition-all duration-300 border border-transparent hover:border-slate-200">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Update Password</h4>
                  <p className="text-xs text-slate-500">Last changed 3 months ago</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary" />
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Two-Factor Auth</h4>
                  <p className="text-xs text-slate-500">Add an extra layer of security</p>
                </div>
              </div>
              <div className="w-12 h-6 bg-primary rounded-full relative p-1 cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1" />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Recent Login History</h5>
              <button className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">View All</button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">MacBook Pro 16"</p>
                    <p className="text-[10px] text-slate-500">London, UK • Active Now</p>
                  </div>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          </div>

          <button className="w-full py-4 text-sm font-bold uppercase tracking-widest text-red-600 border-2 border-red-100 rounded-2xl hover:bg-red-50 transition-colors">
            Sign Out From All Devices
          </button>
        </div>
      </BottomSheet>

      <BottomNav />
    </motion.div>
  );
}
