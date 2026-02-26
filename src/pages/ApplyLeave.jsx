import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, History, Sparkles, Info, MessageSquare, Calendar, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { motion } from 'framer-motion';


const ApplyLeave = () => {
    const { user } = useContext(AuthContext);
    const { isDarkMode } = useContext(ThemeContext);
    const [leaves, setLeaves] = useState([]);
    const [formData, setFormData] = useState({
        leaveType: 'Sick Leave',
        fromDate: '',
        toDate: '',
        reason: ''
    });

    const isDark = isDarkMode;
    const bgColor = isDark ? 'bg-[#0f172a]' : 'bg-slate-50';
    const cardBg = isDark ? 'bg-[#1e293b]/50 border-white/10 shadow-2xl backdrop-blur-xl' : 'bg-white border-slate-200 shadow-xl';
    const inputBg = isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-100 text-slate-700';
    const textColor = isDark ? 'text-slate-50' : 'text-slate-900'; // Duration Black/White Fix
    const subTextColor = isDark ? 'text-indigo-200/60' : 'text-slate-500';
    const labelColor = isDark ? 'text-indigo-400' : 'text-slate-400';

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/leaves/user/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (Array.isArray(res.data)) setLeaves(res.data);
        } catch (err) {
            console.error("Fetch failed.");
        }
    };

    useEffect(() => { if (user?.id) fetchHistory(); }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/leaves/apply`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Request Submitted.");
            setFormData({ leaveType: 'Sick Leave', fromDate: '', toDate: '', reason: '' });
            fetchHistory();
        } catch (err) { alert("Submission failure."); }
    };

    return (
        <div className={`min-h-screen transition-all duration-500 ${bgColor} p-4 md:p-10 font-sans custom-scrollbar`}>
            {/* Standard Style Tag (Fixes the JSX error) */}
            <style>
                {`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { 
                    background: ${isDark ? '#334155' : '#cbd5e1'}; 
                    border-radius: 10px; 
                }
                input[type="date"]::-webkit-calendar-picker-indicator {
                    filter: ${isDark ? 'invert(1)' : 'none'};
                }
                `}
            </style>

            <div className="max-w-7xl mx-auto space-y-10">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isDark ? 'bg-blue-900/40 text-blue-400 border border-blue-500/30' : 'bg-blue-100 text-blue-600'}`}>
                                Time-Off Portal
                            </span>
                            <Sparkles className="text-yellow-500 animate-pulse" size={18} />
                        </div>
                        <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${textColor}`}>
                            Leave <span className="text-blue-600 italic">Management</span>
                        </h1>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-5">
                        <form onSubmit={handleSubmit} className={`${cardBg} p-8 md:p-10 rounded-[2.5rem] space-y-8 border-t border-white/5`}>
                            <h2 className={`text-xl md:text-2xl font-black flex items-center gap-3 ${textColor}`}>
                                <div className="p-2 bg-blue-600 rounded-lg"><Send size={20} className="text-white" /></div>
                                New Request
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-2 ${subTextColor}`}>Leave Type</label>
                                    <div className="relative">
                                        <select
                                            className={`w-full p-5 rounded-2xl outline-none transition-all font-bold border-2 focus:border-blue-500 appearance-none cursor-pointer ${inputBg} ${isDark ? 'focus:bg-[#1e293b]' : 'focus:bg-white'}`}
                                            value={formData.leaveType}
                                            onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                                        >
                                            {/* Fix for visibility in Dark Theme */}
                                            <option className={isDark ? 'bg-[#0f172a] text-white' : 'bg-white text-slate-800'}>Sick Leave</option>
                                            <option className={isDark ? 'bg-[#0f172a] text-white' : 'bg-white text-slate-800'}>Casual Leave</option>
                                            <option className={isDark ? 'bg-[#0f172a] text-white' : 'bg-white text-slate-800'}>Annual Leave</option>
                                            <option className={isDark ? 'bg-[#0f172a] text-white' : 'bg-white text-slate-800'}>Maternity/Paternity Leave</option>
                                        </select>
                                        <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none" size={18} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <input type="date" required className={`w-full p-5 rounded-2xl outline-none font-bold border-2 focus:border-blue-500 transition-all ${inputBg} [color-scheme:${isDark ? 'dark' : 'light'}]`} value={formData.fromDate} onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })} />
                                    <input type="date" required className={`w-full p-5 rounded-2xl outline-none font-bold border-2 focus:border-blue-500 transition-all ${inputBg} [color-scheme:${isDark ? 'dark' : 'light'}]`} value={formData.toDate} onChange={(e) => setFormData({ ...formData, toDate: e.target.value })} />
                                </div>

                                <textarea placeholder="Describe your reason..." required className={`w-full p-5 h-32 rounded-[1.5rem] outline-none font-bold border-2 focus:border-blue-500 transition-all resize-none ${inputBg}`} value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} />
                            </div>

                            <button type="submit" className="group w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-3">
                                Submit Request
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-7">
                        <div className={`rounded-[2.5rem] border overflow-hidden transition-all duration-500 h-full flex flex-col ${cardBg} border-t border-white/5`}>
                            <div className="p-8 border-b flex justify-between items-center">
                                <h2 className={`text-xl md:text-2xl font-black flex items-center gap-3 ${textColor}`}>
                                    <div className="p-2 bg-orange-500 rounded-lg"><History size={20} className="text-white" /></div>
                                    Recent History
                                </h2>
                            </div>

                            <div className="overflow-x-auto flex-grow">
                                <table className="w-full text-left">
                                    <thead className={`${isDark ? 'bg-slate-900/30' : 'bg-slate-50/50'}`}>
                                        <tr className={`text-[10px] font-black uppercase tracking-widest ${labelColor}`}>
                                            <th className="px-10 py-5">Type & Status</th>
                                            <th className="px-10 py-5 text-center">Duration</th>
                                            <th className="px-10 py-5 text-right">Admin Note</th>
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-100'}`}>
                                        {leaves.length > 0 ? leaves.map((leave) => (
                                            <tr key={leave._id} className="group hover:bg-blue-600/[0.02] transition-all">
                                                <td className="px-10 py-8">
                                                    <div className={`font-black text-lg ${textColor}`}>{leave.leaveType}</div>
                                                    <span className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${leave.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' :
                                                        leave.status === 'Rejected' ? 'bg-rose-500/10 text-rose-500' : 'bg-orange-500/10 text-orange-500'
                                                        }`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full mr-2 ${leave.status === 'Approved' ? 'bg-emerald-500' : leave.status === 'Rejected' ? 'bg-rose-500' : 'bg-orange-500'}`} />
                                                        {leave.status}
                                                    </span>
                                                </td>
                                                {/* DURATION TEXT COLOR FIX */}
                                                <td className={`px-10 py-8 text-center font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                                                    <div className="text-sm">{new Date(leave.fromDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</div>
                                                    <div className="text-[10px] opacity-40 uppercase">to</div>
                                                    <div className="text-sm">{new Date(leave.toDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</div>
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    {leave.adminReason ? (
                                                        <div className="flex flex-col items-end">
                                                            <div className={`text-[10px] font-black uppercase ${labelColor} mb-1 flex items-center gap-1`}><MessageSquare size={10} /> Admin Note</div>
                                                            <div className={`text-xs italic font-medium ${subTextColor} max-w-[150px]`}>"{leave.adminReason}"</div>
                                                        </div>
                                                    ) : <span className="text-[10px] font-black uppercase text-slate-500 italic opacity-40">Under Review</span>}
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="3" className="p-32 text-center opacity-30">
                                                    <Info className="mx-auto mb-4" size={40} />
                                                    <p className="text-[10px] font-black uppercase tracking-widest">No History Data</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ApplyLeave;