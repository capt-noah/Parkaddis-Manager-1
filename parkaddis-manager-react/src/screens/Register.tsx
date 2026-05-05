import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Mail, Badge, Lock, CheckCircle } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-grow flex flex-col items-center justify-center p-6 sm:p-12"
    >
      <div className="w-full max-w-lg">
        {/* Branding Header */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-12 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-headline font-extrabold text-2xl tracking-tighter">P</span>
            </div>
            <div className="flex items-center">
              <span className="font-headline font-extrabold text-2xl tracking-tighter text-primary uppercase">Park</span>
              <span className="font-headline font-extrabold text-2xl tracking-tighter text-slate-400 uppercase">Addis</span>
            </div>
          </div>
        </div>

        {/* Registration Card */}
        <div className="bg-white w-full rounded-3xl overflow-hidden shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-slate-100">
          <div className="bg-primary p-8 text-center border-b border-dashed border-white/20">
            <h2 className="text-white font-headline text-2xl font-bold">Admin Registration</h2>
            <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-2">COMPLETE THE FORM TO SET UP YOUR ADMINISTRATIVE PROFILE</p>
          </div>

          <div className="p-8 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Identity & Account</h3>
                
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 px-1">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                      className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-headline font-semibold"
                      placeholder="Abebe Bikila"
                      type="text"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Work Email */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 px-1">Work Email</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                      </div>
                      <input
                        className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-headline font-semibold"
                        placeholder="abebe.b@parkaddis.com"
                        type="email"
                        required
                      />
                    </div>
                  </div>

                  {/* Employee ID */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 px-1">Employee ID</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Badge className="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                      </div>
                      <input
                        className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-headline font-semibold"
                        placeholder="PA-9921"
                        type="text"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 px-1">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                      className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-headline font-semibold"
                      placeholder="••••••••"
                      type="password"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-primary text-white font-headline font-bold py-5 rounded-2xl shadow-xl shadow-primary/20 hover:bg-emerald-900 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
                >
                  <span>Complete Registration</span>
                  <CheckCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-slate-500 text-sm">
                  Already have an admin account? 
                  <Link className="text-primary font-bold hover:underline ml-1" to="/login">Log In</Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* System Footer */}
        <footer className="mt-12 text-center pb-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">© 2024 ParkAddis Management Systems. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <a className="text-slate-400 hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-wider" href="#">Privacy Policy</a>
            <a className="text-slate-400 hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-wider" href="#">Help Center</a>
          </div>
        </footer>
      </div>
    </motion.div>
  );
}
