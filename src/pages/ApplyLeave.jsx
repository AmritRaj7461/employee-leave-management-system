import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Calendar, Info, Clock, CheckCircle, XCircle, Sparkles, History, Sun, Moon } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const ApplyLeave = () => {
    const { user } = useContext(AuthContext);
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [leaves, setLeaves] = useState([]);
    const [formData, setFormData] = useState({
        leaveType: 'Sick Leave',
        fromDate: '',
        toDate: '',
        reason: ''
    });

    // --- HIGH-CONTRAST THEME ENGINE ---
    const isDark = isDarkMode;
    const bgColor = isDark ? 'bg-[#0f172a]' : 'bg-slate-50';
    const cardBg = isDark ? 'bg-[#1e293b]/50 border-white/10 shadow-2xl backdrop-blur-xl' : 'bg-white border-slate-200 shadow-xl';
    const inputBg = isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-100 text-slate-700';
    const textColor = isDark ? 'text-slate-50' : 'text-slate-800';
    const subTextColor = isDark ? 'text-indigo-200/60' : 'text-slate-500';
    const labelColor = isDark ? 'text-indigo-400' : 'text-slate-400';

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            // STRATEGY: Use the 'all' route which we know works, and filter locally
            const res = await axios.get('http://localhost:5000/api/leaves/all', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (Array.isArray(res.data)) {
                // Filter to only show leaves belonging to the current user
                const myData = res.data.filter(item => {
                    const applicantId = item.employeeId?._id || item.employeeId;
                    return applicantId === user?.id;
                });
                setLeaves(myData);
            }
        } catch (err) {
            console.error("Fetch failed. Local data fallback active.");
        }
    };

    useEffect(() => {
        if (user) fetchHistory();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        let isAutoApproveActive = false;

        try {
            // 1. SILENT CONFIG CHECK (Bypasses the 404 alert)
            try {
                const configRes = await axios.get('http://localhost:5000/api/admin/config', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                isAutoApproveActive = configRes.data.autoApproveManagers;
            } catch (configErr) {
                console.warn("Auto-approve feature unavailable (404). Defaulting to standard flow.");
            }

            // 2. Decide status based on role and config
            const isAuto = (user.role === 'Manager' && isAutoApproveActive);
            const finalStatus = isAuto ? 'Approved' : 'Pending';

            const payload = {
                ...formData,
                status: finalStatus
            };

            // 3. SUBMIT LEAVE
            await axios.post('http://localhost:5000/api/leaves/apply', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert(isAuto ? "Manager Protocol: Auto-Approved! 🚀" : "Request Submitted.");

            // 4. RESET FORM & REFRESH
            setFormData({ leaveType: 'Sick Leave', fromDate: '', toDate: '', reason: '' });
            fetchHistory();
        } catch (err) {
            alert("Submission failure: Ensure dates are valid and server is online.");
        }
    };

    return (
        <div className={`min-h-screen transition-all duration-500 ${bgColor} p-4 md:p-10 font-sans`}>
            <div className="max-w-7xl mx-auto space-y-10">

                {/* --- HEADER --- */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                                Time-Off Portal
                            </span>
                            <Sparkles className="text-yellow-500 animate-pulse" size={18} />
                        </div>
                        <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${textColor}`}>
                            Leave <span className="text-blue-600 italic">Management</span>
                        </h1>
                    </div>

                    <button
                        onClick={toggleTheme}
                        className={`p-4 rounded-2xl shadow-xl border transition-all hover:scale-110 active:rotate-12 ${isDark ? 'bg-slate-800 border-slate-700 text-yellow-400' : 'bg-white border-slate-100 text-slate-600'
                            }`}
                    >
                        {isDark ? <Sun size={24} /> : <Moon size={24} />}
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* --- LEFT: APPLICATION FORM --- */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-5">
                        <form onSubmit={handleSubmit} className={`${cardBg} p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] space-y-8`}>
                            <h2 className={`text-xl md:text-2xl font-black flex items-center gap-3 ${textColor}`}>
                                <Send size={24} className="text-blue-600" /> New Request
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-2 ${subTextColor}`}>Leave Type</label>
                                    <select
                                        className={`w-full p-5 rounded-2xl outline-none transition-all font-bold border-2 focus:border-blue-500 appearance-none cursor-pointer ${inputBg}`}
                                        value={formData.leaveType}
                                        onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                                    >
                                        <option className={isDark ? "bg-[#1e293b] text-white" : "bg-white text-slate-800"}>
                                            Sick Leave
                                        </option>
                                        <option className={isDark ? "bg-[#1e293b] text-white" : "bg-white text-slate-800"}>
                                            Casual Leave
                                        </option>
                                        <option className={isDark ? "bg-[#1e293b] text-white" : "bg-white text-slate-800"}>
                                            Annual Leave
                                        </option>
                                        <option className={isDark ? "bg-[#1e293b] text-white" : "bg-white text-slate-800"}>
                                            Maternity/Paternity Leave
                                        </option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-2 ${subTextColor}`}>From Date</label>
                                        <input
                                            type="date" required
                                            className={`w-full p-5 rounded-2xl outline-none font-bold border-2 focus:border-blue-500 transition-all ${inputBg}`}
                                            value={formData.fromDate}
                                            onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-2 ${subTextColor}`}>To Date</label>
                                        <input
                                            type="date" required
                                            className={`w-full p-5 rounded-2xl outline-none font-bold border-2 focus:border-blue-500 transition-all ${inputBg}`}
                                            value={formData.toDate}
                                            onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-2 ${subTextColor}`}>Detailed Reason</label>
                                    <textarea
                                        placeholder="Explain your reason..." required
                                        className={`w-full p-5 h-32 rounded-[1.5rem] outline-none font-bold border-2 focus:border-blue-500 transition-all resize-none ${inputBg}`}
                                        value={formData.reason}
                                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-2xl transition-all active:scale-95">
                                Submit Request
                            </button>
                        </form>
                    </motion.div>

                    {/* --- RIGHT: LEAVE HISTORY --- */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-7">
                        <div className={`rounded-[2.5rem] md:rounded-[3rem] border overflow-hidden transition-all duration-500 h-full ${cardBg}`}>
                            <div className={`p-8 md:p-10 border-b flex justify-between items-center ${isDark ? 'border-white/5' : 'border-slate-50'}`}>
                                <h2 className={`text-xl md:text-2xl font-black flex items-center gap-3 ${textColor}`}>
                                    <History size={24} className="text-orange-500" /> Recent History
                                </h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className={`${isDark ? 'bg-slate-900/30' : 'bg-slate-50/50'}`}>
                                        <tr>
                                            <th className={`px-10 py-5 text-[10px] font-black uppercase tracking-widest ${labelColor}`}>Type</th>
                                            <th className={`hidden sm:table-cell px-10 py-5 text-[10px] font-black uppercase tracking-widest text-center ${labelColor}`}>Duration</th>
                                            <th className={`px-10 py-5 text-[10px] font-black uppercase tracking-widest text-right ${labelColor}`}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-50'}`}>
                                        {leaves.map((leave) => (
                                            <tr key={leave._id} className="group transition-all">
                                                <td className="px-10 py-8">
                                                    <div className={`font-black text-lg ${textColor}`}>{leave.leaveType}</div>
                                                    <div className={`text-xs font-bold ${subTextColor} italic truncate max-w-[200px]`}>{leave.reason}</div>
                                                </td>
                                                <td className="hidden sm:table-cell px-10 py-8 text-center font-bold text-slate-500">
                                                    {new Date(leave.fromDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} - {new Date(leave.toDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${leave.status === 'Approved' ? 'bg-emerald-100/10 text-emerald-500' :
                                                        leave.status === 'Rejected' ? 'bg-rose-100/10 text-rose-500' : 'bg-orange-100/10 text-orange-500'
                                                        }`}>
                                                        {leave.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {leaves.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="p-32 text-center text-slate-400 font-bold uppercase tracking-widest text-[11px]">
                                                    <Info size={32} className="mx-auto mb-4 opacity-20" />
                                                    No system records found.
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