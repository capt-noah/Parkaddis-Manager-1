import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Car, CreditCard, Banknote, Clock, Hash, CheckCircle } from 'lucide-react';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

export default function ManualReservation() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/success');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-grow flex flex-col pb-32"
    >
      <TopBar />
      
      <main className="px-6 max-w-4xl mx-auto w-full pt-2">
        <div className="mb-6">
          <h2 className="text-xl font-headline font-bold tracking-tight text-primary leading-tight">Manual Reservation</h2>
        </div>

        {/* Manual Reservation Form */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-8 border-b border-dashed border-slate-100 relative">
            {/* Ticket Notch Decorative Elements */}
            <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-background rounded-full border border-slate-100" />
            <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-background rounded-full border border-slate-100" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Vehicle Plate Number</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-primary text-slate-900 font-semibold placeholder:text-slate-300"
                    placeholder="ABC-1234"
                    type="text"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Vehicle Model</label>
                <div className="relative">
                  <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-primary text-slate-900 font-semibold placeholder:text-slate-300"
                    placeholder="Tesla Model 3 (Black)"
                    type="text"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Estimated Duration (minutes)</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-primary text-slate-900 font-semibold placeholder:text-slate-300"
                    placeholder="60"
                    type="number"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Payment Type</label>
                <div className="flex gap-2">
                  <label className="flex-1 cursor-pointer">
                    <input defaultChecked className="hidden peer" name="payment" type="radio" value="cash" />
                    <div className="flex items-center justify-center gap-2 py-3 bg-slate-50 peer-checked:bg-primary peer-checked:text-white rounded-xl transition-all font-semibold text-sm text-slate-500">
                      <Banknote className="w-4 h-4" />
                      Cash
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input className="hidden peer" name="payment" type="radio" value="transfer" />
                    <div className="flex items-center justify-center gap-2 py-3 bg-slate-50 peer-checked:bg-primary peer-checked:text-white rounded-xl transition-all font-semibold text-sm text-slate-500">
                      <CreditCard className="w-4 h-4" />
                      Transfer
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleSubmit}
                className="w-full bg-primary hover:bg-emerald-900 text-white font-headline font-bold text-lg py-5 rounded-xl shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-3"
              >
                <CheckCircle className="w-6 h-6" />
                Check-in Vehicle
              </button>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </motion.div>
  );
}
