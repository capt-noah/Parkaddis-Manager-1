import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Car, Search, Filter, Clock, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { cn } from '../lib/utils';
import { SessionsSkeleton } from '../components/Skeleton';

interface Session {
  id: string;
  plate: string;
  duration: string;
  accrued: string;
  status: 'active' | 'completed';
  paid: boolean;
  startTime: string;
}

const allSessions: Session[] = [
  { id: '1', plate: "AA 3-28941", duration: "02h 45m", accrued: "110", status: "active", paid: true, startTime: "09:15 AM" },
  { id: '2', plate: "OR B-90112", duration: "00h 15m", accrued: "25", status: "active", paid: false, startTime: "11:45 AM" },
  { id: '3', plate: "AA 4-55120", duration: "01h 10m", accrued: "60", status: "completed", paid: true, startTime: "08:30 AM" },
  { id: '4', plate: "AA 2-11894", duration: "04h 22m", accrued: "180", status: "active", paid: true, startTime: "07:45 AM" },
  { id: '5', plate: "OR 2-A9022", duration: "00h 45m", accrued: "40", status: "completed", paid: false, startTime: "10:00 AM" },
  { id: '6', plate: "AA 1-77231", duration: "03h 05m", accrued: "125", status: "completed", paid: true, startTime: "06:15 AM" },
];

export default function Sessions() {
  const [filter, setFilter] = useState<'all' | 'active' | 'unpaid' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredSessions = allSessions.filter(session => {
    let matchesFilter = false;
    if (filter === 'all') {
      matchesFilter = true;
    } else if (filter === 'active') {
      matchesFilter = session.status === 'active';
    } else if (filter === 'unpaid') {
      matchesFilter = session.status === 'completed' && !session.paid;
    } else if (filter === 'completed') {
      matchesFilter = session.status === 'completed' && session.paid;
    }
    const matchesSearch = session.plate.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-grow flex flex-col pb-32"
    >
      <TopBar />
      
      {isLoading ? (
        <SessionsSkeleton />
      ) : (
        <main className="px-6 max-w-7xl mx-auto w-full pt-2">
          <section className="mb-6">
            <h2 className="text-xl font-headline font-bold tracking-tight text-primary leading-tight">All Sessions</h2>
          </section>

          {/* Search and Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text"
                placeholder="Search by plate number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide items-center">
              {(['all', 'active', 'unpaid', 'completed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                    filter === f 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Sessions List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <motion.div
                  layout
                  key={session.id}
                  className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                          <Car className="w-6 h-6 text-slate-400" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-slate-900">{session.plate}</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Started at {session.startTime}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {session.status === 'active' ? (
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-emerald-50 text-emerald-600">
                            Active
                          </span>
                        ) : session.paid ? (
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-primary/10 text-primary">
                            Completed
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-red-50 text-red-600">
                            Unpaid
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-dashed border-slate-100">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</p>
                        <p className="text-sm font-bold text-slate-900">{session.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Accrued</p>
                        <p className="text-sm font-bold text-slate-900">ETB {session.accrued}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No sessions found</h3>
                <p className="text-sm text-slate-500">Try adjusting your search or filter</p>
              </div>
            )}
          </div>
        </main>
      )}

      <BottomNav />
    </motion.div>
  );
}
