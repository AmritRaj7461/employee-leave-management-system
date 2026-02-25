import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Check, X, Users, Clock, CheckCircle, Sparkles, ShieldCheck, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const ManagerDashboard = () => {
    const { user } = useContext(AuthContext);
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const [requests, setRequests] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });

    // --- HIGH-CONTRAST THEME ENGINE ---
    const isDark = isDarkMode;
    const bgColor = isDark ? 'bg-[#0f172a]' : 'bg-slate-50';
    const cardBg = isDark ? 'bg-[#1e293b]/50 border-white/10 shadow-2xl backdrop-blur-xl' : 'bg-white border-slate-200 shadow-xl';
    const textColor = isDark ? 'text-slate-50' : 'text-slate-800';
    const subTextColor = isDark ? 'text-indigo-200/60' : 'text-slate-500';
    const labelColor = isDark ? 'text-indigo-400' : 'text-slate-400';

    const fetchAll = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/leaves/all', {
                headers: { Authorization: `Bearer ${token}` }
            });

            // FILTER: Hide manager's own leaves from the management view
            const filteredData = res.data.filter(r => r.employeeId?._id !== user?.id);
            setRequests(filteredData);

            const pending = filteredData.filter(r => r.status === 'Pending').length;
            const approved = filteredData.filter(r => r.status === 'Approved').length;
            setStats({ total: filteredData.length, pending, approved });
        } catch (err) { console.error("Error fetching requests"); }
    };

    useEffect(() => {
        if (user) fetchAll();
    }, [user]);

    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/leaves/status/${id}`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAll();
        } catch (err) { alert("Update failed"); }
    };

    return (
        <div className={`min-h-screen transition-all duration-500 ${bgColor} p-6 md:p-10 font-sans`}>
            <div className="max-w-7xl mx-auto space-y-10">

                {/* --- HEADER WITH THEME TOGGLE --- */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isDark ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                                Team Management
                            </span>
                            <Sparkles className="text-yellow-500 animate-pulse" size={18} />
                        </div>
                        <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${textColor}`}>
                            Manager <span className="text-blue-600">Overview</span>
                        </h1>
                        <p className={`font-medium text-lg ${subTextColor}`}>
                            Review team requests. Your personal leaves are handled by Admin.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className={`p-4 rounded-2xl shadow-xl border transition-all hover:scale-110 active:rotate-12 ${isDark ? 'bg-slate-800 border-slate-700 text-yellow-400' : 'bg-white border-slate-100 text-slate-600'
                                }`}
                        >
                            {isDark ? <Sun size={24} /> : <Moon size={24} />}
                        </button>

                        <div className={`px-6 py-3 rounded-2xl border flex items-center gap-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                            <ShieldCheck className="text-emerald-500" size={18} />
                            <span className={`text-[10px] font-black uppercase tracking-widest ${textColor}`}>Authority Active</span>
                        </div>
                    </div>
                </header>

                {/* --- MANAGER STATS GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatCard label="Team Requests" value={stats.total} icon={<Users size={28} />} color="blue" isDarkMode={isDark} />
                    <StatCard label="Pending" value={stats.pending} icon={<Clock size={28} />} color="orange" isDarkMode={isDark} />
                    <StatCard label="Approved" value={stats.approved} icon={<CheckCircle size={28} />} color="emerald" isDarkMode={isDark} />
                </div>

                {/* --- TEAM LEAVE HISTORY TABLE --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-[3rem] border overflow-hidden transition-all duration-500 ${cardBg}`}
                >
                    <div className={`p-8 md:p-10 border-b flex justify-between items-center ${isDark ? 'border-white/5' : 'border-slate-50'}`}>
                        <h2 className={`text-2xl font-black flex items-center gap-3 ${textColor}`}>
                            Team Records
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className={`${isDark ? 'bg-slate-900/30' : 'bg-slate-50/50'}`}>
                                <tr className={`uppercase text-[10px] font-black tracking-widest ${labelColor}`}>
                                    <th className="px-10 py-6">Employee</th>
                                    <th className="px-10 py-6 text-center">Duration</th>
                                    <th className="px-10 py-6 text-center">Status</th>
                                    <th className="px-10 py-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-50'}`}>
                                {requests.map((req) => (
                                    <tr key={req._id} className={`group transition-all hover:${isDark ? 'bg-blue-900/10' : 'bg-blue-50/30'}`}>
                                        <td className="px-10 py-8">
                                            <div className={`font-black text-lg ${textColor}`}>{req.employeeId?.name || "Unknown User"}</div>
                                            <div className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-blue-400' : 'text-blue-500'}`}>{req.leaveType}</div>
                                        </td>
                                        <td className={`px-10 py-8 text-center font-bold text-sm ${subTextColor}`}>
                                            {new Date(req.fromDate).toLocaleDateString()} - {new Date(req.toDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-10 py-8 text-center">
                                            <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${req.status === 'Approved' ? 'bg-emerald-100/10 text-emerald-500' :
                                                req.status === 'Rejected' ? 'bg-rose-100/10 text-rose-500' : 'bg-orange-100/10 text-orange-500'
                                                }`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            {req.status === 'Pending' && (
                                                <div className="flex justify-end gap-3">
                                                    <button onClick={() => updateStatus(req._id, 'Approved')} className="p-3 bg-emerald-500 text-white rounded-xl shadow-lg transition-all">
                                                        <Check size={18} />
                                                    </button>
                                                    <button onClick={() => updateStatus(req._id, 'Rejected')} className="p-3 bg-rose-500 text-white rounded-xl shadow-lg transition-all">
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon, color, isDarkMode }) => {
    const colors = { blue: 'text-blue-500 bg-blue-500/10', orange: 'text-orange-500 bg-orange-500/10', emerald: 'text-emerald-500 bg-emerald-500/10' };
    return (
        <motion.div whileHover={{ y: -5 }} className={`p-8 rounded-[2.5rem] border transition-all duration-500 group relative overflow-hidden ${isDarkMode ? 'bg-[#1e293b]/50 border-white/10 shadow-2xl' : 'bg-white border-slate-100 shadow-xl'}`}>
            <div className="relative z-10 flex justify-between items-center">
                <div>
                    <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] mb-2">{label}</p>
                    <h3 className={`text-4xl font-black tracking-tighter ${isDarkMode ? 'text-slate-50' : 'text-slate-800'}`}>{value}</h3>
                </div>
                <div className={`p-5 rounded-3xl transition-all duration-500 ${colors[color]} group-hover:rotate-12`}>{icon}</div>
            </div>
        </motion.div>
    );
};

export default ManagerDashboard;