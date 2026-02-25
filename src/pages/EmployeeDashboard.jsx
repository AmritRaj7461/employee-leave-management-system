import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import {
    Moon, Sun, Calendar, CheckCircle, Clock,
    ArrowUpRight, Plus, Wallet, Coffee, Sparkles,
    History as HistoryIcon,
    ChevronRight
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const EmployeeDashboard = () => {
    const { user } = useContext(AuthContext);
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({ pending: 0, approved: 0, balance: 10 });
    const [history, setHistory] = useState([]);

    // Manual Theme Variables (Ensures 100% sync with toggle)
    const bgColor = isDarkMode ? 'bg-[#0f172a]' : 'bg-slate-50';
    const cardBg = isDarkMode ? 'bg-[#1e293b]/50 border-white/10 shadow-2xl backdrop-blur-xl' : 'bg-white border-slate-200 shadow-xl';
    const textColor = isDarkMode ? 'text-white' : 'text-slate-800';
    const subTextColor = isDarkMode ? 'text-slate-400' : 'text-slate-500';

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(`http://localhost:5000/api/leaves/user/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const leaves = res.data;
            setHistory(leaves.slice(0, 5));
            setStats({
                pending: leaves.filter(l => l.status === 'Pending').length,
                approved: leaves.filter(l => l.status === 'Approved').length,
                balance: 12 - leaves.filter(l => l.status === 'Approved').length
            });
        } catch (err) {
            console.error("Dashboard data fetch failed");
        }
    };

    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    return (
        <div className={`min-h-screen transition-all duration-500 ${bgColor} p-4 md:p-8 lg:p-10 font-sans`}>
            <div className="max-w-7xl mx-auto space-y-8 lg:space-y-12">

                {/* --- ULTRA PRO HEADER --- */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-2"
                    >
                        <div className="flex items-center gap-3">
                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                                {user?.role} Portal
                            </span>
                            <Sparkles className="text-yellow-500 animate-pulse" size={18} />
                        </div>
                        <h1 className={`text-3xl md:text-5xl font-black tracking-tight ${textColor}`}>
                            {getGreeting()}, <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">{user?.name}</span>
                        </h1>
                        <p className={`font-medium text-base md:text-lg ${subTextColor}`}>
                            Everything looks solid. Here is your overview.
                        </p>
                    </motion.div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        <button
                            onClick={toggleTheme}
                            className={`p-3 md:p-4 rounded-2xl shadow-xl border transition-all hover:scale-110 active:rotate-12 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-yellow-400' : 'bg-white border-slate-100 text-slate-600'}`}
                        >
                            {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
                        </button>
                        <button
                            onClick={() => navigate('/apply-leave')}
                            className="flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.2rem] md:rounded-2xl font-black shadow-2xl shadow-blue-500/40 transition-all hover:-translate-y-1 active:scale-95 text-sm md:text-base"
                        >
                            <Plus size={20} /> Apply Leave
                        </button>
                    </div>
                </header>

                {/* --- PRO STATS GRID --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    <StatCard
                        label="Pending Requests"
                        value={stats.pending}
                        icon={<Clock size={28} />}
                        color="orange"
                        isDarkMode={isDarkMode}
                    />
                    <StatCard
                        label="Approved Leaves"
                        value={stats.approved}
                        icon={<CheckCircle size={28} />}
                        color="emerald"
                        isDarkMode={isDarkMode}
                    />
                    <StatCard
                        label="Leave Balance"
                        value={`${stats.balance} Days`}
                        icon={<Wallet size={28} />}
                        color="blue"
                        isDarkMode={isDarkMode}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                    {/* --- RECENT LEAVE HISTORY TABLE --- */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`lg:col-span-8 rounded-[2.5rem] md:rounded-[3rem] border overflow-hidden transition-all duration-500 ${cardBg}`}
                    >
                        <div className={`p-6 md:p-10 border-b flex justify-between items-center ${isDarkMode ? 'border-white/5' : 'border-slate-50'}`}>
                            <h2 className={`text-xl md:text-2xl font-black flex items-center gap-3 ${textColor}`}>
                                <HistoryIcon size={24} className="text-blue-600" /> Recent History
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className={`${isDarkMode ? 'bg-slate-900/30' : 'bg-slate-50/50'}`}>
                                    <tr>
                                        <th className="px-6 md:px-10 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                        <th className="hidden sm:table-cell px-6 md:px-10 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Duration</th>
                                        <th className="px-6 md:px-10 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-slate-50'}`}>
                                    {history.map((item, idx) => (
                                        <tr key={idx} className={`group transition-all hover:${isDarkMode ? 'bg-blue-900/10' : 'bg-blue-50/30'}`}>
                                            <td className="px-6 md:px-10 py-6 md:py-8">
                                                <div className={`font-black text-base md:text-lg ${textColor}`}>{item.leaveType}</div>
                                                <div className="text-xs md:text-sm text-slate-400 font-medium italic truncate max-w-[120px] md:max-w-[200px]">{item.reason}</div>
                                            </td>
                                            <td className="hidden sm:table-cell px-6 md:px-10 py-6 md:py-8 text-center font-bold text-slate-500">
                                                {new Date(item.fromDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} - {new Date(item.toDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                            </td>
                                            <td className="px-6 md:px-10 py-6 md:py-8 text-right">
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${item.status === 'Approved' ? 'bg-emerald-100/10 text-emerald-500' :
                                                    item.status === 'Rejected' ? 'bg-rose-100/10 text-rose-500' :
                                                        'bg-orange-100/10 text-orange-500'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {history.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="p-16 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No records found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* --- SIDE PANEL: QUICK INSIGHTS --- */}
                    <div className="lg:col-span-4 space-y-6 md:space-y-8">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden group cursor-pointer"
                        >
                            <div className="relative z-10 space-y-4">
                                <Coffee className="text-white/30" size={40} />
                                <h3 className="text-2xl md:text-3xl font-black leading-tight italic">Health is <br /> Wealth.</h3>
                                <p className="text-white/70 text-sm md:text-base font-medium leading-relaxed">
                                    "Your body holds deep wisdom. Trust in it. Learn from it."
                                </p>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-all duration-1000"></div>
                        </motion.div>

                        <div className={`rounded-[2.5rem] p-8 md:p-10 border transition-all duration-500 ${cardBg}`}>
                            <h3 className={`text-lg md:text-xl font-black mb-6 flex items-center gap-2 ${textColor}`}>
                                <Calendar size={20} className="text-blue-500" /> Holiday Calendar
                            </h3>
                            <div className="space-y-6">
                                <HolidayItem date="25" month="MAR" name="Holi Festival" isDarkMode={isDarkMode} />
                                <HolidayItem date="10" month="APR" name="Eid-ul-Fitr" isDarkMode={isDarkMode} />
                                <HolidayItem date="01" month="MAY" name="Labour Day" isDarkMode={isDarkMode} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Reusable Stat Card Component
const StatCard = ({ label, value, icon, color, isDarkMode }) => {
    const colors = {
        orange: 'text-orange-500 bg-orange-500/10',
        emerald: 'text-emerald-500 bg-emerald-500/10',
        blue: 'text-blue-500 bg-blue-500/10'
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border transition-all duration-500 group relative overflow-hidden ${isDarkMode ? 'bg-[#1e293b]/50 border-white/10 shadow-2xl' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50'
                }`}
        >
            <div className="relative z-10 flex justify-between items-start">
                <div className="space-y-3 md:space-y-5">
                    <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em]">{label}</p>
                    <h3 className={`text-3xl md:text-4xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{value}</h3>
                    <div className="flex items-center gap-1 text-blue-500 text-[10px] font-bold uppercase tracking-widest cursor-pointer group-hover:gap-2 transition-all">
                        Analytics <ChevronRight size={12} />
                    </div>
                </div>
                <div className={`p-4 md:p-5 rounded-2xl md:rounded-3xl transition-all duration-500 ${colors[color]}`}>
                    {icon}
                </div>
            </div>
            <div className={`absolute -bottom-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-20 bg-${color}-500`}></div>
        </motion.div>
    );
};

const HolidayItem = ({ date, month, name, isDarkMode }) => (
    <div className="flex items-center gap-4 group cursor-pointer hover:translate-x-1 transition-all">
        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex flex-col items-center justify-center font-black transition-all ${isDarkMode ? 'bg-slate-900 text-slate-200 group-hover:bg-blue-600' : 'bg-slate-50 text-slate-800 group-hover:bg-blue-600 group-hover:text-white'
            }`}>
            <span className="text-[8px] md:text-[9px] uppercase opacity-60 leading-none mb-1">{month}</span>
            <span className="text-base md:text-lg leading-none">{date}</span>
        </div>
        <p className={`font-bold text-sm md:text-base ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{name}</p>
    </div>
);

export default EmployeeDashboard;