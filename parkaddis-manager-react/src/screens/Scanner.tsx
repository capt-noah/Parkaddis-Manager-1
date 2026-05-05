import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Zap, Keyboard, X, Camera, Loader2, CheckCircle2 } from 'lucide-react';
import { ScannerSkeleton } from '../components/Skeleton';

export default function Scanner() {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
  };

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              navigate('/success');
            }, 800);
            return 100;
          }
          return prev + 20;
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isScanning, navigate]);

  if (isLoading) return <ScannerSkeleton />;

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-slate-900 z-[100] flex flex-col items-center"
    >
      <div className="w-full max-w-2xl h-full flex flex-col">
        {/* Header */}
        <div className="px-6 pt-12 pb-6 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
          <div>
            <h2 className="text-xl font-headline font-bold text-white tracking-tight">QR Scanner</h2>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <main className="flex-grow flex flex-col items-center justify-center px-6">
          {/* Scanner Viewfinder */}
          <div className="relative aspect-square w-full max-w-sm bg-black rounded-[48px] overflow-hidden shadow-2xl border-4 border-white/20">
            {/* Simulated Camera Feed */}
            <div className="absolute inset-0 opacity-50">
              <img 
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Camera Feed"
                className="w-full h-full object-cover blur-[1px]"
              />
            </div>

            {/* Viewfinder Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 relative">
                {/* Corners */}
                <div className="absolute top-0 left-0 w-14 h-14 border-t-4 border-l-4 border-primary rounded-tl-3xl" />
                <div className="absolute top-0 right-0 w-14 h-14 border-t-4 border-r-4 border-primary rounded-tr-3xl" />
                <div className="absolute bottom-0 left-0 w-14 h-14 border-b-4 border-l-4 border-primary rounded-bl-3xl" />
                <div className="absolute bottom-0 right-0 w-14 h-14 border-b-4 border-r-4 border-primary rounded-br-3xl" />
                
                {/* Scanning Line */}
                {!isScanning && (
                  <motion.div 
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_rgba(16,185,129,0.8)] z-10"
                  />
                )}

                {/* Scanning State Overlay */}
                <AnimatePresence>
                  {isScanning && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex flex-col items-center justify-center rounded-3xl z-20"
                    >
                      {scanProgress < 100 ? (
                        <>
                          <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
                          <p className="text-white font-bold text-sm uppercase tracking-widest">Processing...</p>
                          <div className="mt-4 w-32 h-1.5 bg-white/20 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${scanProgress}%` }}
                              className="h-full bg-white"
                            />
                          </div>
                        </>
                      ) : (
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex flex-col items-center"
                        >
                          <CheckCircle2 className="w-16 h-16 text-white mb-2" />
                          <p className="text-white font-bold text-sm uppercase tracking-widest">Success!</p>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Scanner Info Overlay */}
            <div className="absolute bottom-10 left-0 right-0 flex justify-center">
              <div className="bg-black/60 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/10">
                <p className="text-[10px] font-bold text-white uppercase tracking-[0.3em]">Auto-detecting QR Code</p>
              </div>
            </div>
          </div>

          {/* Scanner Controls */}
          <div className="grid grid-cols-3 gap-8 mt-12 w-full max-w-sm">
            <button className="flex flex-col items-center gap-3 group">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-primary group-hover:bg-white/10 transition-all">
                <Zap className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Flash</span>
            </button>
            <button 
              onClick={startScan}
              disabled={isScanning}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-20 h-20 rounded-3xl bg-primary shadow-2xl shadow-primary/40 flex items-center justify-center text-white group-hover:scale-110 active:scale-95 transition-all">
                <Camera className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Scan</span>
            </button>
            <button 
              onClick={() => navigate('/manual-reservation')}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-tertiary group-hover:bg-white/10 transition-all">
                <Keyboard className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Manual</span>
            </button>
          </div>
        </main>

        {/* Footer Info */}
        <div className="px-6 pb-12 text-center">
          <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">ParkAddis Terminal B • Secure Entry</p>
        </div>
      </div>
    </motion.div>
  );
}
