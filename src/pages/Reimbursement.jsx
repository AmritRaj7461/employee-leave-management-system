import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Wallet, Plus, Clock, CheckCircle, History, IndianRupee, Sparkles, Send, Sun, Moon, Info } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Reimbursement = () => {
    const { user } = useContext(AuthContext);
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const [claims, setClaims] = useState([]);
    const [formData, setFormData] = useState({ title: '', amount: '' });

    // --- HIGH-CONTRAST THEME ENGINE ---
    const isDark = isDarkMode;
    const bgColor = isDark ? 'bg-[#0f172a]' : 'bg-slate-50';
    const cardBg = isDark ? 'bg-[#1e293b]/50 border-white/10 shadow-2xl backdrop-blur-xl' : 'bg-white border-slate-200 shadow-xl';
    const inputBg = isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-100 text-slate-700';
    const textColor = isDark ? 'text-slate-50' : 'text-slate-800';
    const subTextColor = isDark ? 'text-indigo-200/60' : 'text-slate-500';
    const labelColor = isDark ? 'text-indigo-400' : 'text-slate-400';

    const fetchClaims = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            // FALLBACK STRATEGY: Fetch all and filter locally to ensure data shows
            const res = await axios.get('http://localhost:5000/api/reimbursement/all', { headers });

            if (Array.isArray(res.data)) {
                const myClaims = res.data.filter(item => {
                    const applicantId = item.employeeId?._id || item.employeeId;
                    return applicantId === user?.id;
                });
                setClaims(myClaims);
            }
        } catch (err) {
            console.error("Expense sync interrupted. Using local fallback.");
        }
    };

    useEffect(() => { if (user) fetchClaims(); }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/reimbursement/apply', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert(user.role === 'Admin' ? "Financial Protocol: Claim Auto-Approved! 🚀" : "Claim Submitted Successfully!");
            setFormData({ title: '', amount: '' });
            fetchClaims(); // Refresh list immediately
        } catch (err) {
            alert("Failed to submit claim. Security core connection lost.");
        }
    };

    return (
        <div className={`min-h-screen transition-all duration-500 ${bgColor} p-4 md:p-10 font-sans`}>
            <div className="max-w-7xl mx-auto space-y-10">

                {/* --- HEADER --- */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isDark ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                                Financial Portal
                            </span>
                            <Sparkles className="text-yellow-500 animate-pulse" size={18} />
                        </div>
                        <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${textColor}`}>
                            Expense <span className="text-indigo-600 italic">Claims</span>
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
                    {/* --- LEFT: SUBMISSION FORM --- */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-5">
                        <form onSubmit={handleSubmit} className={`${cardBg} p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] space-y-8`}>
                            <h2 className={`text-xl md:text-2xl font-black flex items-center gap-3 ${textColor}`}>
                                <Plus size={24} className="text-indigo-600" /> New Expense
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-2 ${subTextColor}`}>Description</label>
                                    <input
                                        type="text" placeholder="e.g., Internet Bills" required
                                        className={`w-full p-5 rounded-2xl outline-none transition-all font-bold border-2 focus:border-indigo-500 ${inputBg}`}
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-2 ${subTextColor}`}>Amount (₹)</label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input
                                            type="number" placeholder="0.00" required
                                            className={`w-full p-5 pl-12 rounded-2xl outline-none font-bold border-2 focus:border-indigo-500 transition-all ${inputBg}`}
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg shadow-2xl transition-all hover:-translate-y-1 active:scale-95">
                                Submit Claim
                            </button>
                        </form>
                    </motion.div>

                    {/* --- RIGHT: RECENT CLAIMS --- */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-7">
                        <div className={`rounded-[2.5rem] md:rounded-[3rem] border overflow-hidden transition-all duration-500 h-full ${cardBg}`}>
                            <div className={`p-8 md:p-10 border-b flex justify-between items-center ${isDark ? 'border-white/5' : 'border-slate-50'}`}>
                                <h2 className={`text-xl md:text-2xl font-black flex items-center gap-3 ${textColor}`}>
                                    <History size={24} className="text-indigo-600" /> Recent Claims
                                </h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className={`${isDark ? 'bg-slate-900/30' : 'bg-slate-50/50'}`}>
                                        <tr>
                                            <th className={`px-10 py-5 text-[10px] font-black uppercase tracking-widest ${labelColor}`}>Title</th>
                                            <th className={`px-10 py-5 text-[10px] font-black uppercase tracking-widest text-center ${labelColor}`}>Amount</th>
                                            <th className={`px-10 py-5 text-[10px] font-black uppercase tracking-widest text-right ${labelColor}`}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-50'}`}>
                                        {claims.map((claim) => (
                                            <tr key={claim._id} className="group transition-all">
                                                <td className="px-10 py-8">
                                                    <div className={`font-black text-lg ${textColor}`}>{claim.title}</div>
                                                    <div className={`text-xs font-bold ${subTextColor}`}>
                                                        {claim.createdAt ? new Date(claim.createdAt).toLocaleDateString('en-GB') : "Recently Added"}
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8 text-center font-black text-indigo-500 text-lg md:text-xl">
                                                    ₹{Number(claim.amount).toLocaleString()}
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${claim.status === 'Approved' ? 'bg-emerald-100/10 text-emerald-500' :
                                                        claim.status === 'Rejected' ? 'bg-rose-100/10 text-rose-500' : 'bg-orange-100/10 text-orange-500'
                                                        }`}>
                                                        {claim.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {claims.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="p-32 text-center text-slate-400 font-bold uppercase tracking-widest text-[11px]">
                                                    <Info size={32} className="mx-auto mb-4 opacity-20" />
                                                    No financial records found.
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

export default Reimbursement;