import React, { useContext } from 'react';
import { Users, FileCheck, AlertCircle, Settings, Shield, Activity, Globe, Zap, Sun, Moon } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);

    // --- HIGH-CONTRAST THEME ENGINE ---
    const isDark = isDarkMode;
    const bgColor = isDark ? 'bg-[#0f172a]' : 'bg-slate-50';
    const cardBg = isDark ? 'bg-[#1e293b]/50 border-white/10 shadow-2xl backdrop-blur-xl' : 'bg-white border-slate-200 shadow-xl';

    // Primary Text: Flip between Slate-50 (Dark Mode) and Slate-800 (Light Mode)
    const textColor = isDark ? 'text-slate-50' : 'text-slate-800';

    // Sub-text: Flip between Indigo-tinted white and standard Slate-500
    const subTextColor = isDark ? 'text-indigo-200/60' : 'text-slate-500';

    return (
        <div className={`min-h-screen transition-all duration-500 ${bgColor} p-6 md:p-10 font-sans`}>
            <div className="max-w-7xl mx-auto space-y-10">

                {/* --- HEADER WITH THEME TOGGLE --- */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isDark ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                                Root Authority
                            </span>
                            <Shield className="text-blue-500 animate-pulse" size={18} />
                        </div>
                        <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${textColor}`}>
                            System <span className="text-blue-600">Overview</span>
                        </h1>
                        <p className={`font-medium text-lg ${subTextColor}`}>
                            Global platform status and real-time statistics.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className={`p-4 rounded-2xl shadow-xl border transition-all hover:scale-110 active:rotate-12 ${isDark ? 'bg-slate-800 border-slate-700 text-yellow-400' : 'bg-white border-slate-100 text-slate-600'
                                }`}
                        >
                            {isDark ? <Sun size={24} /> : <Moon size={24} />}
                        </button>

                        <div className={`px-6 py-3 rounded-2xl border flex items-center gap-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                            <span className={`text-[10px] font-black uppercase tracking-widest ${textColor}`}>Server: Operational</span>
                        </div>
                    </div>
                </header>

                {/* --- ADMIN STATS GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <AdminStatCard
                        label="Total Users"
                        value="42"
                        icon={<Users size={28} />}
                        color="blue"
                        isDarkMode={isDark}
                    />
                    <AdminStatCard
                        label="Active Leaves"
                        value="08"
                        icon={<FileCheck size={28} />}
                        color="emerald"
                        isDarkMode={isDark}
                    />
                    <AdminStatCard
                        label="System Alerts"
                        value="0"
                        icon={<AlertCircle size={28} />}
                        color="rose"
                        isDarkMode={isDark}
                    />
                </div>

                {/* --- SYSTEM CONTROLS SECTION --- */}
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    className={`p-8 md:p-12 rounded-[3rem] flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden ${isDark ? 'bg-indigo-600 shadow-2xl shadow-indigo-500/20' : 'bg-slate-900 shadow-2xl shadow-slate-900/20'}`}
                >
                    <div className="relative z-10 text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl font-black mb-3 text-white italic">Platform Controls</h2>
                        <p className="text-indigo-100/70 font-medium max-w-md">
                            Manage system-wide configuration, adjust role permissions, and monitor global security logs.
                        </p>
                    </div>

                    <button className="relative z-10 bg-white text-indigo-600 px-10 py-5 rounded-[1.5rem] font-black flex items-center gap-3 hover:bg-indigo-50 transition-all shadow-xl active:scale-95">
                        <Settings size={22} className="animate-spin-slow" />
                        <span className="uppercase tracking-widest text-sm">Configure Core</span>
                    </button>

                    {/* Background Decorative Elements */}
                    <div className="absolute -right-10 -bottom-10 opacity-10">
                        <Globe size={240} className="text-white" />
                    </div>
                </motion.div>

                {/* --- QUICK ACTIONS BAR --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <QuickLink icon={<Activity size={18} />} label="Security Logs" isDarkMode={isDark} />
                    <QuickLink icon={<Users size={18} />} label="User Directory" isDarkMode={isDark} />
                    <QuickLink icon={<Zap size={18} />} label="API Status" isDarkMode={isDark} />
                    <QuickLink icon={<Settings size={18} />} label="Maintenance" isDarkMode={isDark} />
                </div>
            </div>
        </div>
    );
};

// Internal Component for Admin Cards
const AdminStatCard = ({ label, value, icon, color, isDarkMode }) => {
    const colors = {
        blue: 'text-blue-500 bg-blue-500/10',
        emerald: 'text-emerald-500 bg-emerald-500/10',
        rose: 'text-rose-500 bg-rose-500/10'
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`p-8 rounded-[2.5rem] border transition-all duration-500 group relative overflow-hidden ${isDarkMode ? 'bg-[#1e293b]/50 border-white/10 shadow-2xl' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50'}`}
        >
            <div className="relative z-10 flex justify-between items-center">
                <div>
                    <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] mb-2">{label}</p>
                    <h3 className={`text-5xl font-black tracking-tighter ${isDarkMode ? 'text-slate-50' : 'text-slate-800'}`}>{value}</h3>
                </div>
                <div className={`p-5 rounded-3xl transition-all duration-500 ${colors[color]} group-hover:scale-110 group-hover:rotate-12`}>
                    {icon}
                </div>
            </div>
        </motion.div>
    );
};

const QuickLink = ({ icon, label, isDarkMode }) => (
    <div className={`p-5 rounded-2xl border flex items-center gap-4 cursor-pointer transition-all hover:translate-x-1 ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'}`}>
        <div className="text-blue-500">{icon}</div>
        <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{label}</span>
    </div>
);

export default AdminDashboard;