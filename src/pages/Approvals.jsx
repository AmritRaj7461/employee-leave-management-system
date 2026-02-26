import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import {
    Check, X, Clock, History, Sparkles, AlertCircle,
    RotateCcw, MessageSquare, ShieldCheck, Eye, FileText, ExternalLink, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

const Approvals = () => {
    const { user } = useContext(AuthContext);
    const { isDarkMode } = useContext(ThemeContext);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [reimbursementClaims, setReimbursementClaims] = useState([]);
    const [view, setView] = useState('leaves');

    // MODAL STATES
    const [rejectionModal, setRejectionModal] = useState({ show: false, id: null, type: null });
    const [rejectionText, setRejectionText] = useState("");
    const [reApproveModal, setReApproveModal] = useState({ show: false, id: null, name: "" });

    // DOCUMENT VIEWER STATE
    const [selectedProof, setSelectedProof] = useState(null);
    const [isImageLoading, setIsImageLoading] = useState(true);

    const isDark = isDarkMode;
    const bgColor = isDark ? 'bg-[#0f172a]' : 'bg-slate-50';
    const cardBg = isDark ? 'bg-[#1e293b]/50 border-white/10 shadow-2xl backdrop-blur-xl' : 'bg-white border-slate-200 shadow-xl';
    const textColor = isDark ? 'text-slate-50' : 'text-slate-900';
    const subTextColor = isDark ? 'text-indigo-200/60' : 'text-slate-500';
    const labelColor = isDark ? 'text-indigo-400' : 'text-slate-400';

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const [leaveRes, reimRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/leaves/all`, { headers }).catch(() => ({ data: [] })),
                axios.get(`${API_BASE_URL}/api/reimbursement/all`, { headers }).catch(() => ({ data: [] }))
            ]);

            const filterData = (data) => {
                if (!Array.isArray(data)) return [];
                return data.filter(item => {
                    const applicant = item.employeeId;
                    if (!applicant) return false;
                    return (applicant._id || applicant) !== user?.id;
                });
            };

            setLeaveRequests(filterData(leaveRes.data));
            setReimbursementClaims(filterData(reimRes.data));
        } catch (err) { console.error("Portal sync error."); }
    };

    useEffect(() => { if (user) fetchData(); }, [user]);

    const getFilePath = (item) => {
        return item.receipt || item.proof || item.document || item.file || null;
    };

    const getFullProofURL = (item) => {
        let rawPath = item.receipt || item.proof || item.document || item.file;
        if (!rawPath) return null;
        rawPath = rawPath.replace(/\\/g, "/");
        rawPath = rawPath.replace(/^\/+/, "");

        while (rawPath.startsWith("uploads/")) {
            rawPath = rawPath.replace("uploads/", "");
        }

        return `${API_BASE_URL}/uploads/${rawPath}`;
    };

    const handleUpdate = async (type, id, status, reason = "") => {
        const token = localStorage.getItem('token');
        const url = type === 'leaves'
            ? `${API_BASE_URL}/api/leaves/status/${id}`
            : `${API_BASE_URL}/api/reimbursement/status/${id}`;

        const payload = type === 'leaves'
            ? { status, adminReason: reason }
            : { status, rejectionReason: reason };

        try {
            await axios.put(url, payload, { headers: { Authorization: `Bearer ${token}` } });
            setRejectionModal({ show: false, id: null, type: null });
            setReApproveModal({ show: false, id: null, name: "" });
            setRejectionText("");
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || "Update failed");
        }
    };

    const activeData = (view === 'leaves' ? leaveRequests : reimbursementClaims).filter(i => i.status === 'Pending');
    const historyData = (view === 'leaves' ? leaveRequests : reimbursementClaims).filter(i => i.status !== 'Pending');

    return (
        <div className={`min-h-screen transition-all duration-500 ${bgColor} p-6 md:p-10 font-sans relative`}>
            <style>
                {`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: ${isDark ? '#334155' : '#cbd5e1'}; border-radius: 10px; }
                `}
            </style>

            <div className="max-w-7xl mx-auto space-y-10 relative z-10">
                <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isDark ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>Control Core</span>
                            <Sparkles className="text-yellow-500 animate-pulse" size={18} />
                        </div>
                        <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${textColor}`}>Platform <span className="text-blue-600 italic">Control</span></h1>
                    </div>
                </header>

                <div className={`flex p-1.5 rounded-2xl border w-fit ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <button onClick={() => setView('leaves')} className={`px-12 py-3 rounded-xl font-black uppercase text-[11px] tracking-widest transition-all ${view === 'leaves' ? 'bg-blue-600 text-white shadow-xl' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>Leaves</button>
                    <button onClick={() => setView('reimbursements')} className={`px-12 py-3 rounded-xl font-black uppercase text-[11px] tracking-widest transition-all ${view === 'reimbursements' ? 'bg-blue-600 text-white shadow-xl' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>Expenses</button>
                </div>

                {/* PENDING TABLE */}
                <div className="space-y-6">
                    <h2 className={`flex items-center gap-3 text-lg font-black uppercase tracking-[0.2em] px-2 ${isDark ? 'text-orange-400' : 'text-slate-700'}`}><Clock size={24} className="animate-pulse" /> Pending Decisions</h2>
                    <div className={`rounded-[2.5rem] border overflow-hidden ${cardBg} border-t border-white/5`}>
                        <table className="w-full text-left">
                            <thead className={isDark ? 'bg-slate-900/50' : 'bg-slate-50/50'}>
                                <tr className={`uppercase text-[10px] font-black tracking-widest ${labelColor}`}>
                                    <th className="px-10 py-7">Applicant</th>
                                    <th className="px-10 py-7 text-center">Reference</th>
                                    <th className="px-10 py-7 text-right">Decision</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-50'}`}>
                                {activeData.map((item) => {
                                    const proofURL = getFullProofURL(item);
                                    return (
                                        <tr key={item._id} className="group hover:bg-blue-600/[0.04] transition-all">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-6">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${isDark ? 'bg-[#1e293b] text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{(item.employeeId?.name || "U").charAt(0)}</div>
                                                    <div>
                                                        <div className={`font-black text-lg ${textColor}`}>{item.employeeId?.name || "Unknown"}</div>
                                                        <div className="text-[10px] font-black text-blue-500 uppercase">{item.employeeId?.role}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={`px-10 py-8 text-center font-black text-xs uppercase tracking-widest ${subTextColor}`}>
                                                {view === 'leaves' ? item.leaveType : item.title}
                                                {view === 'reimbursements' && proofURL && (
                                                    <button
                                                        onClick={() => {
                                                            setIsImageLoading(true);
                                                            setSelectedProof(proofURL);
                                                        }}
                                                        className="mt-3 flex items-center gap-2 px-4 py-2 bg-blue-600/10 text-blue-500 rounded-xl mx-auto hover:bg-blue-600 hover:text-white transition-all border border-blue-500/20"
                                                    >
                                                        <Eye size={14} strokeWidth={3} />
                                                        <span className="text-[10px] font-black uppercase tracking-tighter">View Proof</span>
                                                    </button>
                                                )}
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button onClick={() => handleUpdate(view, item._id, 'Approved')} className="p-3 bg-emerald-500 text-white rounded-xl shadow-lg hover:scale-110 transition-all"><Check size={20} strokeWidth={3} /></button>
                                                    <button onClick={() => setRejectionModal({ show: true, id: item._id, type: view })} className="p-3 bg-rose-500 text-white rounded-xl shadow-lg hover:scale-110 transition-all"><X size={20} strokeWidth={3} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* PROCESSED HISTORY */}
                <div className="space-y-6">
                    <h2 className={`flex items-center gap-3 text-lg font-black uppercase tracking-[0.2em] px-2 ${isDark ? 'text-blue-400' : 'text-slate-700'}`}><History size={24} /> Processed History</h2>
                    <div className={`rounded-[2.5rem] border overflow-hidden ${cardBg} border-t border-white/5`}>
                        <table className="w-full text-left">
                            <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-50'}`}>
                                {historyData.map((item) => {
                                    const proofURL = getFullProofURL(item);
                                    return (
                                        <tr key={item._id} className="hover:bg-white/5 transition-colors duration-300">
                                            <td className="px-10 py-7">
                                                <div className={`font-bold text-lg ${textColor}`}>{item.employeeId?.name}</div>
                                                {(item.adminReason || item.rejectionReason) && (
                                                    <div className="flex items-center gap-2 mt-1 text-[10px] text-rose-400 font-bold uppercase italic">
                                                        <MessageSquare size={10} /> Note: {item.adminReason || item.rejectionReason}
                                                    </div>
                                                )}
                                            </td>
                                            <td className={`px-10 py-7 text-center font-black text-[10px] uppercase tracking-widest ${subTextColor}`}>
                                                {view === 'leaves' ? item.leaveType : item.title}
                                                {view === 'reimbursements' && proofURL && (
                                                    <button onClick={() => {
                                                        setIsImageLoading(true);
                                                        setSelectedProof(proofURL);
                                                    }} className="block mx-auto mt-2 p-2 bg-slate-500/10 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                                                        <FileText size={16} />
                                                    </button>
                                                )}
                                            </td>
                                            <td className="px-10 py-7 text-right flex items-center justify-end gap-4">
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${item.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>{item.status}</span>
                                                {item.status === 'Rejected' && user?.role === 'Admin' && view === 'leaves' && (
                                                    <button onClick={() => setReApproveModal({ show: true, id: item._id, name: item.employeeId?.name })} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-black text-[9px] uppercase hover:bg-indigo-50 shadow-lg"><RotateCcw size={14} /> Re-approve</button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* DOCUMENT VIEWER MODAL */}
            <AnimatePresence>
                {selectedProof && (
                    <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/95 backdrop-blur-xl p-6 md:p-12">
                        {/* Control Bar */}
                        <div className="absolute top-10 right-10 flex gap-4 z-[5001]">
                            <a href={selectedProof} target="_blank" rel="noreferrer" className="p-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all flex items-center gap-2 shadow-2xl">
                                <ExternalLink size={24} />
                            </a>
                            <button onClick={() => setSelectedProof(null)} className="p-4 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all shadow-2xl"><X size={32} /></button>
                        </div>

                        {/* Loading Indicator */}
                        {isImageLoading && (
                            <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 text-white/40">
                                <Loader2 size={48} className="animate-spin text-blue-500" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Initiating Document Fetch...</p>
                            </div>
                        )}

                        <div className={`w-full h-full flex items-center justify-center max-w-6xl transition-opacity duration-500 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}>
                            {selectedProof.toLowerCase().endsWith('.pdf') ? (
                                <iframe
                                    src={`${selectedProof}#toolbar=0`}
                                    className="w-full h-full rounded-3xl bg-white border-none shadow-2xl"
                                    onLoad={() => setIsImageLoading(false)}
                                    title="PDF Proof Viewer"
                                />
                            ) : (
                                <img
                                    src={selectedProof}
                                    alt="Receipt Proof"
                                    onLoad={() => setIsImageLoading(false)}
                                    className="max-h-full max-w-full rounded-2xl shadow-2xl border border-white/10 object-contain"
                                    onError={(e) => {
                                        setIsImageLoading(false);
                                        e.target.src = "https://via.placeholder.com/800x600/1e293b/ffffff?text=Document+Load+Failure";
                                    }}
                                />
                            )}
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* REJECTION MODAL */}
            <AnimatePresence>
                {rejectionModal.show && (
                    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className={`max-w-md w-full p-8 rounded-[2.5rem] border ${cardBg}`}>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-rose-500/20 text-rose-500 rounded-2xl"><AlertCircle size={28} /></div>
                                <h3 className={`text-xl font-black uppercase ${textColor}`}>Reject Request</h3>
                            </div>
                            <textarea value={rejectionText} onChange={(e) => setRejectionText(e.target.value)} className={`w-full h-32 p-5 rounded-2xl border outline-none font-bold text-sm ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`} placeholder="Provide justification..." />
                            <div className="flex gap-3 mt-8">
                                <button onClick={() => setRejectionModal({ show: false })} className="flex-1 py-4 font-black uppercase text-[10px] text-slate-500 transition-all hover:text-slate-300">Cancel</button>
                                <button onClick={() => handleUpdate(rejectionModal.type, rejectionModal.id, 'Rejected', rejectionText)} className="flex-1 py-4 bg-rose-500 text-white rounded-xl font-black uppercase text-[10px] shadow-xl shadow-rose-500/20 transition-all hover:bg-rose-600 active:scale-95">Confirm Denial</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* RE-APPROVE MODAL */}
            <AnimatePresence>
                {reApproveModal.show && (
                    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className={`max-w-md w-full p-8 rounded-[3rem] border ${cardBg} text-center shadow-2xl`}>
                            <ShieldCheck size={48} className="mx-auto text-emerald-500 mb-4" />
                            <h3 className={`text-2xl font-black uppercase ${textColor}`}>Confirm Re-approval</h3>
                            <p className="text-sm text-slate-400 mb-8 font-bold italic">Overriding previous rejection for {reApproveModal.name}...</p>
                            <button onClick={() => handleUpdate('leaves', reApproveModal.id, 'Approved', "Re-approved by Administrator")} className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase mb-3 shadow-xl shadow-emerald-500/20 transition-all hover:bg-emerald-600 active:scale-95">Execute Re-approve</button>
                            <button onClick={() => setReApproveModal({ show: false })} className="w-full py-5 font-black uppercase text-slate-500 transition-all hover:text-slate-300">Go Back</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Approvals;