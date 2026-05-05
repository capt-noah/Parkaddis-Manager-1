import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, Share2, Download, ArrowLeft, Printer, Home } from 'lucide-react';
import TopBar from '../components/TopBar';

export default function CheckoutSuccess() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-grow flex flex-col pb-12"
    >
      <TopBar />
      
      <main className="flex-grow flex flex-col px-6 pt-10 max-w-lg mx-auto w-full items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle2 className="w-14 h-14 text-emerald-600" />
        </motion.div>

        <h2 className="text-3xl font-headline font-bold text-slate-900 text-center mb-2">Check-out Successful</h2>
        <p className="text-slate-500 text-center mb-10 max-w-[280px]">The vehicle has been successfully checked out and the session is closed.</p>

        {/* Digital Receipt Card */}
        <div className="w-full bg-white rounded-[32px] shadow-xl border border-slate-100 overflow-hidden mb-8">
          <div className="bg-primary p-6 text-white flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Transaction ID</p>
              <p className="font-mono text-sm font-bold">#PA-882910</p>
            </div>
            <Printer className="w-6 h-6 opacity-60" />
          </div>
          
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Plate Number</span>
              <span className="text-slate-900 font-bold text-lg">AA 3-28941</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Total Duration</span>
              <span className="text-slate-900 font-bold text-lg">02h 45m</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Payment Method</span>
              <span className="text-slate-900 font-bold text-lg">Digital Wallet</span>
            </div>

            <div className="pt-6 border-t border-dashed border-slate-200 flex justify-between items-center">
              <span className="text-primary font-bold text-sm uppercase tracking-widest">Total Paid</span>
              <span className="text-3xl font-headline font-extrabold text-primary">ETB 110</span>
            </div>
          </div>

          <div className="ticket-notch mx-8" />
          
          <div className="p-6 bg-slate-50 flex justify-center gap-4">
            <button className="flex items-center gap-2 text-slate-600 font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors">
              <Download className="w-4 h-4" />
              Save PDF
            </button>
            <div className="w-px h-4 bg-slate-200 self-center" />
            <button className="flex items-center gap-2 text-slate-600 font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>

        <div className="w-full space-y-3">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full bg-primary text-white py-5 rounded-2xl font-headline font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <Home className="w-5 h-5" />
            Back to Dashboard
          </button>
          <button 
            onClick={() => navigate('/scanner')}
            className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-headline font-bold uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Scan Another
          </button>
        </div>
      </main>
    </motion.div>
  );
}
