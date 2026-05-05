import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, QrCode, Car, MapPin, Printer, ArrowLeft } from 'lucide-react';

export default function Success() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-grow flex flex-col items-center p-6 pt-24"
    >
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-primary hover:bg-slate-100 p-2 rounded-full transition-colors active:scale-95"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-headline font-bold tracking-tight text-2xl text-primary">Check-in Success</h1>
        </div>
      </header>

      <div className="w-full max-w-2xl flex flex-col items-center">
        {/* Success Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-primary fill-primary/10" />
            </div>
          </div>
          <div className="absolute -top-1 -right-1">
            <span className="flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
            </span>
          </div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Vehicle Checked In</h2>
          <p className="text-slate-500 font-medium">The vehicle has been successfully assigned to a spot.</p>
        </div>

        {/* Ticket Card */}
        <div className="w-full bg-white rounded-[32px] shadow-xl overflow-hidden border border-slate-100">
          {/* Ticket Header */}
          <div className="p-8 pb-6">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">PLATE NUMBER</span>
                <div className="text-3xl font-extrabold tracking-tight text-primary font-headline">AA 3-28941</div>
              </div>
              <div className="bg-primary/5 p-3 rounded-2xl">
                <QrCode className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100">
              <Car className="w-6 h-6 text-primary fill-primary/20" />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ASSIGNED SLOT</div>
                <div className="text-lg font-bold text-slate-900">Slot A-04</div>
              </div>
            </div>
          </div>

          {/* Perforation Line */}
          <div className="ticket-notch mx-5" />

          {/* Ticket Details */}
          <div className="p-8 pt-6 grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">VEHICLE</span>
              <div className="text-sm font-bold text-slate-900">Tesla Model 3</div>
              <div className="text-[12px] font-medium text-slate-500">Color: Black</div>
            </div>
            <div className="space-y-1 text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ENTRY TIME</span>
              <div className="text-sm font-bold text-slate-900">10:45 AM</div>
              <div className="text-[12px] font-medium text-slate-500">Today, Oct 24</div>
            </div>
          </div>

          {/* Map Preview */}
          <div className="h-24 bg-slate-50 w-full relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Parking Map"
              className="w-full h-full object-cover opacity-20 grayscale"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="px-4 py-1.5 bg-white shadow-sm rounded-full text-[10px] font-bold text-primary flex items-center gap-1.5 border border-primary/10">
                <MapPin className="w-3 h-3 fill-primary" />
                SECTION A, LEVEL 1
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full mt-12 space-y-4">
          <button className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/20">
            <Printer className="w-5 h-5" />
            Print Entry Ticket
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-transparent text-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all active:scale-95"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </motion.div>
  );
}
