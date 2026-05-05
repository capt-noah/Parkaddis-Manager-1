import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Save, 
  Building2, 
  Clock, 
  Car, 
  CreditCard, 
  Plus, 
  Trash2,
  AlertCircle
} from 'lucide-react';
import TopBar from '../../components/TopBar';
import BottomNav from '../../components/BottomNav';

export default function FacilityConfig() {
  const navigate = useNavigate();
  const [capacity, setCapacity] = useState(250);
  const [hourlyRate, setHourlyRate] = useState(20);
  const [gracePeriod, setGracePeriod] = useState(15);

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
              <h2 className="text-lg font-headline font-bold text-slate-900 tracking-tight">Facility</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CONFIGURATION DETAIL</p>
            </div>
          </div>
        </div>

        {/* Configuration Sections */}
        <div className="space-y-8">
          {/* Capacity Section */}
          <section>
            <h3 className="text-[10px] font-headline font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">Terminal Capacity</h3>
            <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Car className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-900">Total Parking Slots</p>
                  <p className="text-xs text-slate-500">Maximum capacity for Terminal A</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setCapacity(Math.max(0, capacity - 10))}
                    className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    <span className="text-xl font-bold">-</span>
                  </button>
                  <span className="text-lg font-headline font-bold text-slate-900 w-12 text-center">{capacity}</span>
                  <button 
                    onClick={() => setCapacity(capacity + 10)}
                    className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    <span className="text-xl font-bold">+</span>
                  </button>
                </div>
              </div>
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
                <p className="text-[10px] text-blue-700 font-medium leading-relaxed">
                  Increasing capacity will automatically update the real-time occupancy metrics on the dashboard.
                </p>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section>
            <h3 className="text-[10px] font-headline font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">Pricing & Rates</h3>
            <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Hourly Rate</p>
                    <p className="text-xs text-slate-500">Standard vehicle charge</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                    className="w-20 p-3 bg-slate-50 border border-slate-100 rounded-xl text-right font-headline font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                  <span className="text-xs font-bold text-slate-400">ETB</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Grace Period</p>
                    <p className="text-xs text-slate-500">Minutes before charging</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={gracePeriod}
                    onChange={(e) => setGracePeriod(parseInt(e.target.value))}
                    className="w-20 p-3 bg-slate-50 border border-slate-100 rounded-xl text-right font-headline font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                  <span className="text-xs font-bold text-slate-400">MIN</span>
                </div>
              </div>
            </div>
          </section>

          {/* Special Rules */}
          <section>
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-[10px] font-headline font-extrabold uppercase tracking-[0.2em] text-slate-400">Special Rules</h3>
              <button className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add Rule
              </button>
            </div>
            <div className="space-y-3">
              {[
                { title: "Lost Ticket Penalty", value: "500 ETB", type: "Fixed" },
                { title: "Overnight Surcharge", value: "150 ETB", type: "Daily" }
              ].map((rule, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{rule.title}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{rule.type} Charge</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-headline font-bold text-primary">{rule.value}</span>
                    <button className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
