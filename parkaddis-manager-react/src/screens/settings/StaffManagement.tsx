import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Users, 
  UserPlus, 
  Search, 
  MoreVertical, 
  Shield, 
  BadgeCheck,
  Clock,
  ChevronRight,
  Filter
} from 'lucide-react';
import TopBar from '../../components/TopBar';
import BottomNav from '../../components/BottomNav';

export default function StaffManagement() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const staff = [
    { id: 1, name: "Abebe Bikila", role: "Terminal Manager", status: "Active", id_code: "PA-8821", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
    { id: 2, name: "Sara Tadesse", role: "Shift Supervisor", status: "On Break", id_code: "PA-9902", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
    { id: 3, name: "Dawit Kebede", role: "Security Officer", status: "Active", id_code: "PA-7715", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
    { id: 4, name: "Hanna Girma", role: "Terminal Attendant", status: "Offline", id_code: "PA-6642", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" }
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
              <h2 className="text-lg font-headline font-bold text-slate-900 tracking-tight">Staff</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MANAGEMENT DETAIL</p>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-3 mb-8">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search staff by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
            />
          </div>
          <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Staff List */}
        <div className="space-y-4">
          {staff.map((person) => (
            <div key={person.id} className="bg-white rounded-[32px] p-5 border border-slate-100 shadow-sm flex items-center justify-between group hover:border-primary/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-slate-50">
                    <img src={person.avatar} alt={person.name} className="w-full h-full object-cover" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    person.status === 'Active' ? 'bg-emerald-500' : 
                    person.status === 'On Break' ? 'bg-amber-500' : 'bg-slate-300'
                  }`} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{person.name}</h4>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{person.role}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400">{person.id_code}</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                      person.status === 'Active' ? 'text-emerald-600' : 
                      person.status === 'On Break' ? 'text-amber-600' : 'text-slate-400'
                    }`}>{person.status}</span>
                  </div>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Roles Overview */}
        <section className="mt-12">
          <h3 className="text-[10px] font-headline font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">Role Permissions</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
              <Shield className="w-6 h-6 text-primary mb-3" />
              <p className="text-xs font-bold text-slate-900">Manager</p>
              <p className="text-[10px] text-slate-500 font-medium mt-1">Full system access & reports</p>
            </div>
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
              <BadgeCheck className="w-6 h-6 text-emerald-600 mb-3" />
              <p className="text-xs font-bold text-slate-900">Supervisor</p>
              <p className="text-[10px] text-slate-500 font-medium mt-1">Shift management & overrides</p>
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </motion.div>
  );
}
