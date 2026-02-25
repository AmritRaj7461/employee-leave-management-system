import React, { useState, useEffect, useContext, useMemo } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Check, X, Clock, History, Sparkles, Sun, Moon, IndianRupee, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

const Approvals = () => {
    const { user } = useContext(AuthContext);
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [reimbursementClaims, setReimbursementClaims] = useState([]);
    const [view, setView] = useState('leaves');

    const isDark = isDarkMode;
    const bgColor = isDark ? 'bg-[#0f172a]' : 'bg-slate-50';
    const cardBg = isDark ? 'bg-[#1e293b]/50 border-white/10 shadow-2xl backdrop-blur-xl' : 'bg-white border-slate-200 shadow-xl';
    const textColor = isDark ? 'text-slate-50' : 'text-slate-800';
    const subTextColor = isDark ? 'text-indigo-200/60' : 'text-slate-500';
    const labelColor = isDark ? 'text-indigo-400' : 'text-slate-400';

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const [leaveRes, reimRes] = await Promise.all([
                axios.get('http://localhost:5000/api/leaves/all', { headers }).catch(() => ({ data: [] })),
                axios.get('http://localhost:5000/api/reimbursement/all', { headers }).catch(() => ({ data: [] }))
            ]);

            const filterData = (data) => {
                if (!Array.isArray(data)) return [];
                return data.filter(item => {
                    if (!item.employeeId) return true;
                    if (user?.role === 'Admin') return true;
                    if (user?.role === 'Manager') return item.employeeId.role !== 'Admin';
                    return false;
                });
            };

            setLeaveRequests(filterData(leaveRes.data));
            setReimbursementClaims(filterData(reimRes.data));
        } catch (err) {
            console.error("Portal sync error.");
        }
    };

    useEffect(() => { if (user) fetchData(); }, [user]);

    const handleUpdate = async (type, id, status) => {
        const token = localStorage.getItem('token');
        const url = type === 'leaves' ? `http://localhost:5000/api/leaves/status/${id}` : `http://localhost:5000/api/reimbursement/status/${id}`;
        try {
            await axios.put(url, { status }, { headers: { Authorization: `Bearer ${token}` } });
            fetchData();
        } catch (err) { alert("Update failed"); }
    };

    const trendMetrics = useMemo(() => {
        const now = new Date();
        const buckets = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            buckets.push({
                key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
                label: d.toLocaleString('default', { month: 'short' }),
                total: 0
            });
        }

        reimbursementClaims.forEach(c => {
            if (c.status !== 'Approved') return;
            const date = new Date(c.updatedAt || c.createdAt);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const bucket = buckets.find(b => b.key === key);
            if (bucket) bucket.total += Number(c.amount) || 0;
        });

        const maxVal = Math.max(...buckets.map(b => b.total), 1);
        const bars = buckets.map(b => ({
            ...b,
            percent: b.total > 0 ? Math.max((b.total / maxVal) * 100, 15) : 5
        }));

        const current = bars[5].total;
        const previous = bars[4].total;
        const variance = previous > 0 ? ((current - previous) / previous) * 100 : 0;
        return { bars, variance, isUp: current >= previous };
    }, [reimbursementClaims]);

    const totalPayout = useMemo(() => reimbursementClaims
        .filter(c => c.status === 'Approved')
        .reduce((sum, current) => sum + (Number(current.amount) || 0), 0), [reimbursementClaims]);

    const activeData = (view === 'leaves' ? leaveRequests : reimbursementClaims).filter(i => i.status === 'Pending');
    const historyData = (view === 'leaves' ? leaveRequests : reimbursementClaims).filter(i => i.status !== 'Pending');

    return (
        <div className={`min-h-screen transition-all duration-500 ${bgColor} p-6 md:p-8 lg:p-10 font-sans`}>
            <div className="max-w-7xl mx-auto space-y-10">

                {/* --- HEADER --- */}
                <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isDark ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>Control Core</span>
                            <Sparkles className="text-yellow-500 animate-pulse" size={18} />
                        </div>
                        <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${textColor}`}>Platform <span className="text-blue-600 italic">Control</span></h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-5">
                        <div className={`flex items-end gap-3 px-8 py-5 rounded-[2.5rem] border h-24 ${isDark ? 'bg-white/5 border-white/10 shadow-2xl' : 'bg-white border-slate-200 shadow-md'}`}>
                            <div className="flex items-end gap-2 pr-6 border-r border-white/10 h-full">
                                {trendMetrics.bars.map((t, i) => (
                                    <div key={i} className="flex flex-col items-center gap-1 group relative">
                                        <div className="h-12 w-4 flex items-end justify-center">
                                            <motion.div initial={{ height: 0 }} animate={{ height: `${t.percent}%` }} className={`w-full rounded-t-lg transition-all ${isDark ? 'bg-indigo-500' : 'bg-blue-600'} ${t.total > 0 ? 'opacity-100 shadow-[0_0_10px_rgba(79,70,229,0.3)]' : 'opacity-20'}`} />
                                        </div>
                                        <span className="text-[8px] font-black uppercase text-slate-500">{t.label}</span>
                                        <div className="absolute bottom-full mb-3 hidden group-hover:flex flex-col items-center z-50">
                                            <div className="bg-slate-900 text-white text-[10px] font-bold py-1.5 px-3 rounded-xl shadow-2xl">₹{t.total.toLocaleString()}</div>
                                            <div className="w-2 h-2 bg-slate-900 rotate-45 -mt-1" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="pl-4 h-full flex flex-col justify-center min-w-[100px]">
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</p>
                                <div className={`flex items-center gap-2 ${trendMetrics.isUp ? 'text-orange-500' : 'text-emerald-500'}`}>
                                    {trendMetrics.isUp ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                    <span className="text-sm font-black italic">{Math.abs(trendMetrics.variance).toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>

                        <div className={`px-8 py-5 rounded-[2.5rem] border flex items-center gap-5 ${isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white border-slate-200 shadow-lg'}`}>
                            <div className="p-3 bg-emerald-500 rounded-2xl text-white shadow-lg"><IndianRupee size={24} /></div>
                            <div>
                                <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Total Payout</p>
                                <p className={`text-2xl font-black ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>₹{totalPayout.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className={`flex p-1.5 rounded-2xl border w-fit ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <button onClick={() => setView('leaves')} className={`px-12 py-3 rounded-xl font-black uppercase text-[11px] tracking-widest transition-all ${view === 'leaves' ? 'bg-blue-600 text-white shadow-xl' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>Leaves</button>
                    <button onClick={() => setView('reimbursements')} className={`px-12 py-3 rounded-xl font-black uppercase text-[11px] tracking-widest transition-all ${view === 'reimbursements' ? 'bg-blue-600 text-white shadow-xl' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>Expenses</button>
                </div>

                {/* --- PENDING DECISIONS --- */}
                <div className="space-y-6">
                    <h2 className={`flex items-center gap-3 text-lg font-black uppercase tracking-[0.2em] px-2 ${isDark ? 'text-orange-400' : 'text-slate-700'}`}><Clock size={24} className="animate-pulse" /> Pending Decisions</h2>
                    <div className={`rounded-[3.5rem] border overflow-hidden ${cardBg}`}>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className={isDark ? 'bg-slate-900/50' : 'bg-slate-50/50'}>
                                    <tr className={`uppercase text-[10px] font-black tracking-widest ${labelColor}`}>
                                        <th className="px-10 py-7">Applicant</th>
                                        <th className="px-10 py-7 text-center">Reference</th>
                                        <th className="px-10 py-7 text-center">Value</th>
                                        <th className="px-10 py-7 text-right">Decision</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-50'}`}>
                                    {activeData.map((item) => (
                                        <tr key={item._id} className="group hover:bg-blue-600/[0.04] transition-all">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-6">
                                                    <div className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center text-xl font-black ${isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{(item.employeeId?.name || "U").charAt(0)}</div>
                                                    <div>
                                                        <div className={`font-black text-xl ${textColor}`}>{item.employeeId?.name || "Unknown"}</div>
                                                        <div className="text-[10px] font-black text-blue-500 uppercase">{item.employeeId?.role}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={`px-10 py-8 text-center font-black text-xs uppercase tracking-widest ${subTextColor}`}>{view === 'leaves' ? item.leaveType : item.title}</td>

                                            {/* FIXED LOGIC: View-Based Cell Rendering */}
                                            <td className={`px-10 py-8 text-center font-black text-lg ${subTextColor}`}>
                                                {view === 'leaves'
                                                    ? new Date(item.fromDate).toLocaleDateString()
                                                    : `₹${item.amount?.toLocaleString()}`
                                                }
                                            </td>

                                            <td className="px-10 py-8 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button onClick={() => handleUpdate(view, item._id, 'Approved')} className="p-4 bg-emerald-500 text-white rounded-2xl shadow-lg hover:scale-110 active:scale-95 transition-all"><Check size={24} strokeWidth={3} /></button>
                                                    <button onClick={() => handleUpdate(view, item._id, 'Rejected')} className="p-4 bg-rose-500 text-white rounded-2xl shadow-lg hover:scale-110 active:scale-95 transition-all"><X size={24} strokeWidth={3} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* --- PROCESSED HISTORY --- */}
                <div className="space-y-6">
                    <h2 className={`flex items-center gap-3 text-lg font-black uppercase tracking-[0.2em] px-2 ${isDark ? 'text-blue-400' : 'text-slate-700'}`}><History size={24} /> Processed History</h2>
                    <div className={`rounded-[3.5rem] border overflow-hidden opacity-90 ${cardBg}`}>
                        <table className="w-full text-left">
                            <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-50'}`}>
                                {historyData.map((item) => (
                                    <tr key={item._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-10 py-7"><div className={`font-bold text-lg ${textColor}`}>{item.employeeId?.name || "User"}</div></td>
                                        <td className={`px-10 py-7 text-center font-black uppercase tracking-widest text-[10px] ${subTextColor}`}>{view === 'leaves' ? item.leaveType : item.title}</td>

                                        {/* FIXED LOGIC: View-Based Cell Rendering */}
                                        <td className={`px-10 py-7 text-center font-black text-sm ${subTextColor}`}>
                                            {view === 'leaves'
                                                ? new Date(item.fromDate).toLocaleDateString()
                                                : `₹${item.amount?.toLocaleString()}`
                                            }
                                        </td>

                                        <td className="px-10 py-7 text-right">
                                            <span className={`px-6 py-2 rounded-full text-[9px] font-black uppercase ${item.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>{item.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Approvals;