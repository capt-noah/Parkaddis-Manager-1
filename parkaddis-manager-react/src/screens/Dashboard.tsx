import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { TrendingUp, Car, MoreVertical, Activity, Plus, ArrowRight, Clock, CreditCard, CheckCircle2, QrCode } from 'lucide-react';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import TicketCard from '../components/TicketCard';
import BottomSheet from '../components/BottomSheet';
import { cn } from '../lib/utils';
import { DashboardSkeleton } from '../components/Skeleton';

interface Session {
  plate: string;
  duration: string;
  accrued: string;
  status: 'active' | 'completed';
  paid: boolean;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleCheckoutClick = (session: Session) => {
    setSelectedSession(session);
    setIsCheckoutOpen(true);
  };

  const activeSessions: Session[] = [
    { plate: "AA 3-28941", duration: "02h 45m", accrued: "110", status: "active", paid: true },
    { plate: "OR B-90112", duration: "00h 15m", accrued: "25", status: "active", paid: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-grow flex flex-col pb-32"
    >
      <TopBar />
      
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <main className="px-6 max-w-7xl mx-auto w-full">
          <section className="mt-2 mb-6">
            <h2 className="text-xl font-headline font-bold tracking-tight text-primary leading-tight">Terminal Overview</h2>
          </section>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Scan Ticket Card */}
            <button 
              onClick={() => navigate('/scanner')}
              className="col-span-2 lg:col-span-4 bg-white rounded-[32px] p-6 border-2 border-dashed border-slate-200 flex items-center justify-between group hover:border-primary transition-all active:scale-[0.98] mb-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <QrCode className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-headline font-bold text-slate-900">Scan Ticket</h3>
                  <p className="text-xs text-slate-500">Check-in vehicle instantly</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>

            <div className="col-span-2 lg:col-span-2 bg-primary rounded-[32px] p-6 text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2">Current Occupancy</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-headline font-extrabold">82%</span>
                  <div className="flex items-center text-emerald-300 text-xs font-bold bg-white/10 px-2 py-1 rounded-full">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +5%
                  </div>
                </div>
                <div className="mt-4 w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-white h-full w-[82%] rounded-full" />
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <span className="text-[120px] font-extrabold select-none">P</span>
              </div>
            </div>

            <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100 col-span-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Total Revenue</p>
              <p className="text-xl font-headline font-bold text-slate-900">ETB 14.2k</p>
              <p className="text-[10px] text-primary font-bold mt-1">Today</p>
            </div>

            <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100 col-span-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Available Slots</p>
              <p className="text-xl font-headline font-bold text-slate-900">34</p>
              <p className="text-[10px] text-tertiary font-bold mt-1">Critical Low</p>
            </div>
          </div>

          <section className="flex justify-between items-end mb-4">
            <div>
              <h3 className="text-xl font-headline font-bold text-slate-900">Live Feed</h3>
              <p className="text-xs text-secondary">Monitoring active sessions</p>
            </div>
            <button 
              onClick={() => navigate('/sessions')}
              className="text-primary text-[10px] font-bold uppercase tracking-wider flex items-center hover:opacity-70 transition-opacity"
            >
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </button>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeSessions.map((session, idx) => (
              <div key={idx}>
                <TicketCard title={session.plate} subtitle="Plate Number" icon={Car} status={session.status}>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-6">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Duration</p>
                        <p className="text-sm font-semibold text-slate-900">{session.duration}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Accrued</p>
                        <p className="text-sm font-semibold text-slate-900">ETB {session.accrued}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleCheckoutClick(session)}
                        className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide hover:brightness-110 transition-all"
                      >
                        Check-out
                      </button>
                    </div>
                  </div>
                </TicketCard>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* Checkout Bottom Sheet */}
      <BottomSheet
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        title="Vehicle Check-out"
        subtitle="Confirm final payment and exit"
      >
        {selectedSession && (
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <Car className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Plate Number</p>
                  <h3 className="text-2xl font-headline font-bold text-slate-900">{selectedSession.plate}</h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Duration</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900">{selectedSession.duration}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Rate</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900">40 ETB/hr</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-dashed border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Total Fee</span>
                  <span className="text-3xl font-headline font-extrabold text-primary">ETB {selectedSession.accrued}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => {
                  setIsCheckoutOpen(false);
                  navigate('/checkout-success');
                }}
                className="w-full bg-primary text-white py-5 rounded-2xl font-headline font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all"
              >
                <CheckCircle2 className="w-6 h-6" />
                Confirm
              </button>
              <button 
                onClick={() => setIsCheckoutOpen(false)}
                className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-headline font-bold uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </BottomSheet>

      <BottomNav />
    </motion.div>
  );
}
