import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import {
    Moon, Sun, Calendar, CheckCircle, Clock,
    Plus, Wallet, Coffee, Sparkles, Zap, Shield,
    History as HistoryIcon,
    ChevronRight, AlertTriangle
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- THEME-AWARE AI ENGINE COMPONENT ---
const AIInsight = ({ stats, history, nextHoliday, isDarkMode }) => {
    const generateInsight = () => {
        const balance = stats.balance;
        const rejectedCount = history.filter(h => h.status === 'Rejected').length;

        if (balance > 8 && nextHoliday) {
            return {
                title: "Efficiency Protocol",
                msg: `Pair request with ${nextHoliday.name} on ${nextHoliday.date} ${nextHoliday.month} for a 4-day bridge.`,
                icon: <Zap size={18} className={isDarkMode ? "text-yellow-400" : "text-yellow-600"} />,
                // Dynamic theme colors for visibility
                color: isDarkMode
                    ? "border-yellow-500/30 bg-yellow-500/5 shadow-[0_0_20px_rgba(234,179,8,0.1)]"
                    : "border-yellow-200 bg-yellow-50 shadow-sm",
                tag: "Optimization",
                textColor: isDarkMode ? "text-slate-100" : "text-slate-900",
                labelColor: isDarkMode ? "text-white" : "text-yellow-800"
            };
        }
        if (rejectedCount >= 1) {
            return {
                title: "Policy Alignment",
                msg: "Rejection reasons are now visible below. Review feedback before your next submission.",
                icon: <AlertTriangle size={18} className={isDarkMode ? "text-rose-400" : "text-rose-600"} />,
                color: isDarkMode
                    ? "border-rose-500/30 bg-rose-500/5 shadow-[0_0_20px_rgba(244,63,94,0.1)]"
                    : "border-rose-200 bg-rose-50 shadow-sm",
                tag: "System",
                textColor: isDarkMode ? "text-slate-100" : "text-slate-900",
                labelColor: isDarkMode ? "text-white" : "text-rose-800"
            };
        }
        return {
            title: "Core Status",
            msg: "Systems stable. Leave parameters are within nominal operational range.",
            icon: <Sparkles size={18} className={isDarkMode ? "text-blue-400" : "text-blue-600"} />,
            color: isDarkMode
                ? "border-blue-500/30 bg-blue-500/5 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                : "border-blue-200 bg-blue-50 shadow-sm",
            tag: "Nominal",
            textColor: isDarkMode ? "text-slate-100" : "text-slate-900",
            labelColor: isDarkMode ? "text-white" : "text-blue-800"
        };
    };

    const insight = generateInsight();

    return (
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-4 p-4 rounded-2xl border ${insight.color} backdrop-blur-md transition-all group`}>
            <div className={`flex-shrink-0 p-2 rounded-xl border group-hover:scale-110 transition-transform ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                {insight.icon}
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${insight.labelColor}`}>{insight.title}</span>
                    <span className={`text-[7px] font-black bg-blue-600 text-white px-1.5 py-0.5 rounded uppercase`}>{insight.tag}</span>
                </div>
                <p className={`text-[11px] font-bold leading-tight transition-colors ${insight.textColor}`}>{insight.msg}</p>
            </div>
        </motion.div>
    );
};

const EmployeeDashboard = () => {
    const { user } = useContext(AuthContext);
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({ pending: 0, approved: 0, balance: 10 });
    const [history, setHistory] = useState([]);

    const bgColor = isDarkMode ? 'bg-[#0a0c10]' : 'bg-slate-50';
    const cardBg = isDarkMode ? 'bg-[#111827]/80 border-white/10 shadow-2xl backdrop-blur-xl' : 'bg-white border-slate-200 shadow-xl';
    const textColor = isDarkMode ? 'text-white' : 'text-slate-800';

    const inspirationProtocols = [
        { title: "Health is Wealth.", text: "Trust in your body's wisdom. Operational rest is vital.", icon: <Coffee size={36} />, gradient: "from-indigo-600 via-blue-600 to-indigo-700" },
        { title: "Focus. Execute.", text: "Efficiency is doing things right. Impact is doing the right things.", icon: <Zap size={36} />, gradient: "from-emerald-600 via-teal-600 to-emerald-700" },
        { title: "Systems Core.", text: "Your daily routine defines your future system stability.", icon: <Shield size={36} />, gradient: "from-slate-800 via-slate-700 to-slate-900" }
    ];

    const activeProtocol = inspirationProtocols[user?.id ? (user.id.charCodeAt(user.id.length - 1) % inspirationProtocols.length) : 0];

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/leaves/user/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(res.data.slice(0, 5));
            const approved = res.data.filter(l => l.status === 'Approved').length;
            setStats({
                pending: res.data.filter(l => l.status === 'Pending').length,
                approved: approved,
                balance: 12 - approved
            });
        } catch (err) { console.error("Sync failure"); }
    };

    useEffect(() => { if (user) fetchData(); }, [user]);

    const holidays2026 = [{ date: "26", month: "JAN", name: "Republic Day" }, { date: "26", month: "FEB", name: "Maha Shivaratri" }, { date: "04", month: "MAR", name: "Holi Festival", upcoming: true }, { date: "20", month: "MAR", name: "Eid-ul-Fitr" }, { date: "10", month: "APR", name: "Good Friday" }];

    return (
        <div className={`min-h-screen transition-all duration-700 ${bgColor} p-4 md:p-8 lg:p-10 font-sans relative overflow-hidden`}>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,_#3b82f610_0%,_transparent_50%)] pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                <header className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-blue-100 text-blue-600 shadow-sm'}`}>{user?.role} Portal</span>
                                <Sparkles className="text-yellow-500 animate-pulse" size={18} />
                            </div>
                            <h1 className={`text-3xl md:text-5xl font-black tracking-tighter ${textColor}`}>Dashboard, <span className="bg-gradient-to-r from-blue-500 via-indigo-400 to-blue-600 bg-clip-text text-transparent italic">{user?.name}</span></h1>
                        </div>
                        <div className="max-w-xl">
                            <AIInsight stats={stats} history={history} nextHoliday={holidays2026[2]} isDarkMode={isDarkMode} />
                        </div>
                    </motion.div>
                    <div className="flex items-center gap-4">
                        <button onClick={toggleTheme} className={`p-4 rounded-2xl shadow-xl border transition-all hover:scale-110 active:rotate-12 ${isDarkMode ? 'bg-slate-900 border-white/10 text-yellow-400 shadow-yellow-500/5' : 'bg-white border-slate-100 text-slate-600 shadow-sm'}`}>
                            {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
                        </button>
                        <button onClick={() => navigate('/apply-leave')} className="group flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-[0_15px_30px_rgba(37,99,235,0.3)] transition-all active:scale-95 text-sm uppercase tracking-widest">
                            <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Apply Leave
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <StatCard label="Pending Approval" value={stats.pending} icon={<Clock size={28} />} color="orange" isDarkMode={isDarkMode} />
                    <StatCard label="Approved History" value={stats.approved} icon={<CheckCircle size={28} />} color="emerald" isDarkMode={isDarkMode} />
                    <StatCard label="System Balance" value={`${stats.balance} Days`} icon={<Wallet size={28} />} color="blue" isDarkMode={isDarkMode} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    {/* --- RECENT HISTORY SECTION --- */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`lg:col-span-8 rounded-[2.5rem] border overflow-hidden transition-all duration-500 ${cardBg}`}>
                        <div className={`p-8 border-b flex justify-between items-center ${isDarkMode ? 'border-white/5' : 'border-slate-50'}`}>
                            <h2 className={`text-xl font-black flex items-center gap-3 ${textColor}`}><HistoryIcon size={24} className="text-blue-500" /> Recent History</h2>
                        </div>
                        <div className="overflow-x-auto h-[550px]">
                            <table className="w-full text-left">
                                <thead className={`${isDarkMode ? 'bg-slate-900/50' : 'bg-slate-50/50'} sticky top-0 backdrop-blur-sm z-10`}>
                                    <tr>
                                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Request Type</th>
                                        <th className="hidden sm:table-cell px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Duration Vector</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Auth Status</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-slate-50'}`}>
                                    {history.map((item, idx) => (
                                        <tr key={idx} className={`group transition-all hover:${isDarkMode ? 'bg-blue-500/5' : 'bg-slate-50'}`}>
                                            <td className="px-10 py-8">
                                                <div className={`font-black text-base md:text-lg ${textColor} group-hover:text-blue-400 transition-colors`}>{item.leaveType}</div>
                                                <div className="text-[11px] font-medium italic mt-1">
                                                    {item.status === 'Rejected' && item.rejectionReason ? (
                                                        <span className="text-rose-400 font-bold bg-rose-400/10 px-2 py-0.5 rounded shadow-sm">Log: {item.rejectionReason}</span>
                                                    ) : (
                                                        <span className={`${isDarkMode ? 'text-slate-300' : 'text-slate-500'} opacity-90`}>{item.reason}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className={`hidden sm:table-cell px-10 py-8 text-center font-black ${isDarkMode ? 'text-white' : 'text-slate-700'} text-sm tracking-tighter`}>
                                                {new Date(item.fromDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} - {new Date(item.toDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${item.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                                                    item.status === 'Rejected' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                                                        'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                                                    }`}>{item.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* --- SIDEBAR COMPONENTS --- */}
                    <div className="lg:col-span-4 flex flex-col gap-8">
                        <motion.div whileHover={{ scale: 1.02, y: -5 }} className={`flex-1 min-h-[300px] bg-gradient-to-br ${activeProtocol.gradient} rounded-[2.5rem] p-10 text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden group flex flex-col justify-center border border-white/10`}>
                            <div className="relative z-10 space-y-5">
                                <motion.div animate={{ rotate: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="text-white/40 group-hover:text-white transition-colors">{activeProtocol.icon}</motion.div>
                                <h3 className="text-3xl font-black leading-tight italic uppercase tracking-tighter drop-shadow-lg">{activeProtocol.title}</h3>
                                <p className="text-white/80 text-sm font-medium leading-relaxed max-w-[250px]">"{activeProtocol.text}"</p>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
                        </motion.div>

                        {/* Holiday Vault with Alignment fix */}
                        <div className={`h-[320px] flex flex-col rounded-[2.5rem] p-10 border ${cardBg}`}>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className={`text-xl font-black flex items-center gap-3 ${textColor}`}>
                                    <Calendar size={22} className="text-blue-500" /> Holiday <span className="text-blue-500 italic">Vault</span>
                                </h3>
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-md border ${isDarkMode ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-100 shadow-xs'
                                    }`}>2026</span>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-5 pr-2 custom-scrollbar">
                                {holidays2026.map((holiday, index) => (
                                    <HolidayItem key={index} {...holiday} isDarkMode={isDarkMode} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Internal Components
const StatCard = ({ label, value, icon, color, isDarkMode }) => {
    const colors = {
        orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20 shadow-orange-500/5',
        emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/5',
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20 shadow-blue-500/5'
    };
    return (
        <motion.div whileHover={{ y: -8, scale: 1.02 }} className={`p-8 rounded-[2.5rem] border transition-all duration-500 group relative overflow-hidden ${isDarkMode ? 'bg-[#111827] shadow-2xl' : 'bg-white border-slate-100 shadow-xl'}`}>
            <div className="relative z-10 flex justify-between items-start">
                <div className="space-y-2">
                    <p className="text-slate-500 font-black uppercase text-[9px] tracking-[0.3em]">{label}</p>
                    <h3 className={`text-4xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{value}</h3>
                </div>
                <div className={`p-4 rounded-2xl border ${colors[color]} group-hover:rotate-12 group-hover:scale-110 shadow-lg transition-all`}>{icon}</div>
            </div>
            <div className="absolute -bottom-6 -left-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">{React.cloneElement(icon, { size: 100 })}</div>
        </motion.div>
    );
};

const HolidayItem = ({ date, month, name, isDarkMode, upcoming }) => {
    // Dynamic theme styles for the holiday card
    const cardStyle = upcoming
        ? (isDarkMode ? 'bg-blue-600/10 border-blue-500/30' : 'bg-blue-50 border-blue-200 shadow-xs')
        : (isDarkMode ? 'hover:bg-white/5 border-transparent' : 'hover:bg-slate-50 border-transparent');

    const iconStyle = upcoming
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
        : (isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-white border border-slate-200 text-slate-600');

    return (
        <motion.div whileHover={{ x: 5 }} className={`flex items-center gap-4 p-3 rounded-2xl border transition-all cursor-default ${cardStyle}`}>
            <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black transition-all ${iconStyle}`}>
                <span className={`text-[7px] uppercase leading-none mb-0.5 ${upcoming ? 'text-blue-100' : 'opacity-60'}`}>{month}</span>
                <span className="text-base leading-none tracking-tighter">{date}</span>
            </div>
            <div className="flex-1 min-w-0">
                <p className={`font-black text-xs truncate ${isDarkMode ? 'text-slate-200 group-hover:text-blue-400' : 'text-slate-700 group-hover:text-blue-600'} transition-colors`}>{name}</p>
                {upcoming && <span className="text-[7px] font-black uppercase tracking-widest text-blue-500 animate-pulse">Next Up</span>}
            </div>
        </motion.div>
    );
};

export default EmployeeDashboard;