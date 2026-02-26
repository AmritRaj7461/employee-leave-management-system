import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import {
    Plus, History, IndianRupee, Sparkles, Send,
    Sun, Moon, Info, Upload, FileText, X, Eye
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// Define the base URL for fetching uploaded files
const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

const Reimbursement = () => {
    const { user } = useContext(AuthContext);
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const [claims, setClaims] = useState([]);
    const [formData, setFormData] = useState({ title: '', amount: '', proof: null });
    const [preview, setPreview] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null); // Lightbox state

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
            const res = await axios.get(`${API_BASE_URL}/api/reimbursement/all`, { headers });

            if (Array.isArray(res.data)) {
                const myClaims = res.data.filter(item => {
                    const applicantId = item.employeeId?._id || item.employeeId;
                    return applicantId === user?.id;
                });
                setClaims(myClaims);
            }
        } catch (err) {
            console.error("Expense sync interrupted.");
        }
    };

    useEffect(() => { if (user) fetchClaims(); }, [user]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, proof: file });
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const removeFile = () => {
        setFormData({ ...formData, proof: null });
        setPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', formData.title);
        data.append('amount', formData.amount);
        if (formData.proof) data.append('proof', formData.proof);

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/reimbursement/apply`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert("Financial Protocol: Claim Submitted with Proof! 🚀");
            setFormData({ title: '', amount: '', proof: null });
            setPreview(null);
            fetchClaims(); // REFRESH table to replace "None" with "Eye"
        } catch (err) {
            alert("Failed to submit claim. Proof verification failed.");
        }
    };

    // Helper to format file path for browser URL
    const getFileUrl = (path) => {
        if (!path) return null;
        const normalizedPath = path.replace(/\\/g, '/');
        return `${API_BASE_URL}/${normalizedPath}`;
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

                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* --- LEFT: FORM --- */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-5">
                        <form onSubmit={handleSubmit} className={`${cardBg} p-8 md:p-10 rounded-[3rem] space-y-6`}>
                            <h2 className={`text-xl md:text-2xl font-black flex items-center gap-3 ${textColor}`}>
                                <Plus size={24} className="text-indigo-600" /> New Expense
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-2 ${subTextColor}`}>Description</label>
                                    <input type="text" placeholder="e.g., Client Lunch" required className={`w-full p-4 rounded-2xl outline-none font-bold border-2 focus:border-indigo-500 ${inputBg}`}
                                        value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                                </div>

                                <div>
                                    <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-2 ${subTextColor}`}>Amount (₹)</label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input type="number" placeholder="0.00" required className={`w-full p-4 pl-12 rounded-2xl outline-none font-bold border-2 focus:border-indigo-500 ${inputBg}`}
                                            value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-2 ${subTextColor}`}>Supporting Document</label>
                                    {!preview ? (
                                        <label className={`group flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-[2rem] cursor-pointer transition-all ${isDark ? 'border-white/10 hover:border-indigo-500 bg-white/5' : 'border-slate-300 hover:border-indigo-500 bg-slate-50'}`}>
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 mb-3 text-indigo-500 group-hover:scale-110 transition-transform" />
                                                <p className="mb-2 text-xs font-bold text-slate-500 uppercase tracking-widest">Click to upload proof</p>
                                            </div>
                                            <input type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} />
                                        </label>
                                    ) : (
                                        <div className="relative rounded-[2rem] overflow-hidden border-2 border-indigo-500 h-40 group">
                                            {formData.proof?.type.includes('image') ? (
                                                <img src={preview} alt="Proof" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-indigo-600/10 gap-3">
                                                    <FileText size={40} className="text-indigo-500" />
                                                    <span className={`font-bold uppercase text-[10px] ${textColor}`}>{formData.proof.name}</span>
                                                </div>
                                            )}
                                            <button type="button" onClick={removeFile} className="absolute top-3 right-3 p-2 bg-rose-500 text-white rounded-xl shadow-lg">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button type="submit" className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3">
                                <Send size={20} /> Execute Protocol
                            </button>
                        </form>
                    </motion.div>

                    {/* --- RIGHT: HISTORY TABLE --- */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-7">
                        <div className={`rounded-[3rem] border overflow-hidden h-full ${cardBg}`}>
                            <div className={`p-8 border-b flex justify-between items-center ${isDark ? 'border-white/5' : 'border-slate-50'}`}>
                                <h2 className={`text-xl md:text-2xl font-black flex items-center gap-3 ${textColor}`}>
                                    <History size={24} className="text-indigo-600" /> History
                                </h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className={`${isDark ? 'bg-slate-900/30' : 'bg-slate-50/50'}`}>
                                        <tr className={`uppercase text-[10px] font-black tracking-widest ${labelColor}`}>
                                            <th className="px-10 py-5">Title</th>
                                            <th className="px-10 py-5 text-center">Amount</th>
                                            <th className="px-10 py-5 text-right">Proof</th>
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-50'}`}>
                                        {claims.map((claim) => (
                                            <tr key={claim._id} className="hover:bg-indigo-500/5 transition-all">
                                                <td className="px-10 py-8">
                                                    <div className={`font-black text-lg ${textColor}`}>{claim.title}</div>
                                                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter ${claim.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>{claim.status}</span>
                                                </td>
                                                <td className="px-10 py-8 text-center font-black text-indigo-500 text-xl">
                                                    ₹{Number(claim.amount).toLocaleString()}
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    {/* LOGIC FIX: Render Eye only if proof string exists */}
                                                    {claim.proof && claim.proof !== "None" ? (
                                                        <button
                                                            onClick={() => setSelectedImage(getFileUrl(claim.proof))}
                                                            className={`p-3 rounded-xl transition-all ${isDark ? 'bg-white/5 hover:bg-white/10 text-indigo-400' : 'bg-slate-100 hover:bg-indigo-50 text-indigo-600'}`}
                                                        >
                                                            <Eye size={20} />
                                                        </button>
                                                    ) : (
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-40">None</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {claims.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="p-32 text-center text-slate-400 font-bold uppercase tracking-widest text-[11px]">
                                                    <Info size={32} className="mx-auto mb-4 opacity-20" /> No records found.
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

            {/* --- LIGHTBOX MODAL VIEW --- */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-4xl w-full h-[80vh] flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {selectedImage.toLowerCase().endsWith('.pdf') ? (
                                <iframe src={selectedImage} className="w-full h-full rounded-2xl border-4 border-white/10 shadow-2xl" title="Proof Document" />
                            ) : (
                                <img src={selectedImage} alt="Proof Large View" className="max-w-full max-h-full rounded-2xl shadow-2xl border-4 border-white/10 object-contain" />
                            )}
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute -top-12 right-0 text-white hover:text-rose-500 transition-colors"
                            >
                                <X size={32} />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Reimbursement;