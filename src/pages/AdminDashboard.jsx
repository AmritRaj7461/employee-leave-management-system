import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Users, FileCheck, AlertCircle, Settings, Shield,
    Activity, Globe, Zap, Sun, Moon, X, RefreshCcw, Loader2, ShieldAlert
} from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isLogsOpen, setIsLogsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [apiOnline, setApiOnline] = useState(true);
    const [logs, setLogs] = useState([]);
    const settingsRef = useRef(null);

    const [stats, setStats] = useState({ totalUsers: 0, activeRequests: 0, securityFlags: 0 });
    const [config, setConfig] = useState({ strictRoleValidation: true, autoApproveManagers: false, mfaEnabled: false });

    const isDark = isDarkMode;
    const bgColor = isDark ? 'bg-[#0f172a]' : 'bg-slate-50';
    const textColor = isDark ? 'text-slate-50' : 'text-slate-800';
    const subTextColor = isDark ? 'text-indigo-200/60' : 'text-slate-500';

    // --- REAL-TIME ENGINE ---
    const fetchAllData = async (isManualSync = false) => {
        const token = localStorage.getItem('token');
        if (!token) return; // Guard against unauthenticated requests

        if (isManualSync) setSyncing(true);
        else setLoading(true);

        const headers = { Authorization: `Bearer ${token}` };

        try {
            // 1. Fetch Stats in parallel with error handling for each
            const [userRes, leaveRes, reimRes, configRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/auth/users`, { headers }),
                axios.get(`${API_BASE_URL}/api/leaves/all`, { headers }).catch(() => ({ data: [] })),
                axios.get(`${API_BASE_URL}/api/reimbursement/all`, { headers }).catch(() => ({ data: [] })),
                axios.get(`${API_BASE_URL}/api/admin/config`, { headers }).catch(() => ({ data: config }))
            ]);

            const pLeaves = Array.isArray(leaveRes.data) ? leaveRes.data.filter(i => i.status === 'Pending').length : 0;
            const pReims = Array.isArray(reimRes.data) ? reimRes.data.filter(i => i.status === 'Pending').length : 0;

            setStats({
                totalUsers: userRes.data.length || 0,
                activeRequests: pLeaves + pReims,
                securityFlags: 0
            });

            if (configRes.data) setConfig(configRes.data);
            setApiOnline(true);

            if (isManualSync) {
                // Visual feedback for Force Sync
                setTimeout(() => alert("System Synchronized ⚡"), 500);
            }
        } catch (err) {
            console.error("Dashboard Sync Failed");
            setApiOnline(false); // Triggers "API: Critical Failure" visual
        } finally {
            setLoading(false);
            setSyncing(false);
        }
    };

    const fetchSecurityLogs = async () => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const res = await axios.get(`${API_BASE_URL}/api/admin/logs`, { headers });
            setLogs(res.data);
            setIsLogsOpen(true);
        } catch (err) {
            alert("High-Clearance Access Denied.");
        }
    };

    useEffect(() => { fetchAllData(); }, []);

    const updateGlobalConfig = async (newConfig) => {
        setConfig(newConfig);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE_URL}/api/admin/config`, newConfig, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) { console.error("Config write failed"); }
    };

    return (
        <div className={`min-h-screen transition-all duration-500 ${bgColor} p-6 md:p-10 font-sans relative overflow-hidden`}>
            <div className="max-w-7xl mx-auto space-y-10 relative z-10">

                {/* --- HEADER --- */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isDark ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>Root Authority</span>
                            <Shield className="text-blue-500 animate-pulse" size={18} />
                        </div>
                        <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${textColor}`}>System <span className="text-blue-600">Overview</span></h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={toggleTheme} className={`p-4 rounded-2xl shadow-xl border transition-all hover:scale-110 active:rotate-12 ${isDark ? 'bg-slate-800 border-slate-700 text-yellow-400' : 'bg-white border-slate-100 text-slate-600'}`}><Sun size={24} /></button>
                        <div className={`px-6 py-3 rounded-2xl border flex items-center gap-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                            <div className={`h-2 w-2 rounded-full ${apiOnline ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`} />
                            <span className={`text-[10px] font-black uppercase tracking-widest ${textColor}`}>{apiOnline ? 'API: Operational' : 'API: Critical Failure'}</span>
                        </div>
                    </div>
                </header>

                {/* --- STATS GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <AdminStatCard label="Total Entities" value={loading ? "..." : stats.totalUsers} icon={<Users size={28} />} color="blue" isDarkMode={isDark} />
                    <AdminStatCard label="Active Requests" value={loading ? "..." : stats.activeRequests} icon={<FileCheck size={28} />} color="emerald" isDarkMode={isDark} />
                    <AdminStatCard label="Security Flags" value={stats.securityFlags} icon={<AlertCircle size={28} />} color="rose" isDarkMode={isDark} />
                </div>

                {/* --- SYSTEM CONTROLS --- */}
                <motion.div whileHover={{ scale: 1.005 }} className={`p-8 md:p-12 rounded-[3rem] flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden ${isDark ? 'bg-indigo-600 shadow-2xl shadow-indigo-500/20' : 'bg-slate-900 shadow-2xl shadow-slate-900/20'}`}>
                    <div className="relative z-10 text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl font-black mb-3 text-white italic">Platform Controls</h2>
                        <p className="text-indigo-100/70 font-medium max-w-md">Manage core logic, toggle auto-approvals, and monitor system-wide security configurations.</p>
                    </div>
                    <button onClick={() => setIsSettingsOpen(true)} className="settings-toggle-btn relative z-10 bg-white text-indigo-600 px-10 py-5 rounded-[1.5rem] font-black flex items-center gap-3 hover:bg-indigo-50 transition-all shadow-xl active:scale-95">
                        <Settings size={22} className="animate-spin-slow" />
                        <span className="uppercase tracking-widest text-sm">Configure Core</span>
                    </button>
                    <div className="absolute -right-10 -bottom-10 opacity-10"><Globe size={240} className="text-white" /></div>
                </motion.div>

                {/* --- QUICK ACTIONS --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <QuickLink icon={<Activity size={18} />} label="Security Logs" isDarkMode={isDark} onClick={fetchSecurityLogs} />
                    <QuickLink icon={<Users size={18} />} label="User Directory" isDarkMode={isDark} onClick={() => navigate('/admin-panel')} />
                    <QuickLink icon={<Zap size={18} className={syncing ? "animate-pulse" : ""} />} label="API Health" isDarkMode={isDark} onClick={() => fetchAllData(true)} />
                    <QuickLink icon={<RefreshCcw size={18} className={syncing ? "animate-spin" : ""} />} label="Force Sync" isDarkMode={isDark} onClick={() => fetchAllData(true)} />
                </div>
            </div>

            {/* --- SECURITY LOGS MODAL --- */}
            <AnimatePresence>
                {isLogsOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className={`relative max-w-4xl w-full h-[80vh] flex flex-col rounded-[3rem] border ${isDark ? 'bg-[#0f172a] border-white/10' : 'bg-white border-slate-200'}`}>
                            <div className="p-8 border-b flex justify-between items-center">
                                <h2 className={`text-2xl font-black italic ${textColor}`}>System <span className="text-blue-500">Audit Logs</span></h2>
                                <button onClick={() => setIsLogsOpen(false)} className="p-3 hover:bg-rose-500/10 rounded-2xl transition-all"><X size={24} /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-8 space-y-4">
                                {logs.length > 0 ? logs.map((log, idx) => (
                                    <div key={idx} className={`p-4 rounded-2xl border flex items-center justify-between ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                        <div>
                                            <p className="text-xs font-black uppercase text-blue-500 tracking-widest">{log.action}</p>
                                            <p className={`text-sm font-bold ${textColor}`}>{log.details}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-[9px] font-black uppercase ${subTextColor}`}>By: {log.adminId?.name || "System"}</p>
                                            <p className={`text-[9px] ${subTextColor}`}>{new Date(log.timestamp).toLocaleString()}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="h-full flex flex-col items-center justify-center opacity-30">
                                        <ShieldAlert size={48} className="mb-4" />
                                        <p className="font-black uppercase tracking-widest text-xs">No logs recorded yet.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- CONFIGURATION DRAWER --- */}
            <AnimatePresence>
                {isSettingsOpen && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-end">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSettingsOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div ref={settingsRef} initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }} className={`relative w-full max-w-md h-full p-12 flex flex-col border-l ${isDark ? 'bg-[#0b0f1a] border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-2xl'}`}>
                            <div className="flex justify-between items-center mb-12"><h2 className={`text-2xl font-black italic ${textColor}`}>GLOBAL ENGINE</h2><button onClick={() => setIsSettingsOpen(false)} className={textColor}><X size={28} /></button></div>
                            <div className="space-y-10 flex-1">
                                <div className="space-y-6">
                                    <ToggleSetting label="Strict Role Check" active={config.strictRoleValidation} onClick={() => updateGlobalConfig({ ...config, strictRoleValidation: !config.strictRoleValidation })} isDark={isDark} />
                                    <ToggleSetting label="Auto-Approve Mgr" active={config.autoApproveManagers} onClick={() => updateGlobalConfig({ ...config, autoApproveManagers: !config.autoApproveManagers })} isDark={isDark} />
                                    <ToggleSetting label="Multi-Factor Auth" active={config.mfaEnabled} onClick={() => updateGlobalConfig({ ...config, mfaEnabled: !config.mfaEnabled })} isDark={isDark} />
                                </div>
                            </div>
                            <div className={`p-6 rounded-2xl flex items-center gap-4 ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                                <Loader2 className={`text-indigo-500 ${loading || syncing ? 'animate-spin' : ''}`} />
                                <p className={`text-[10px] font-black uppercase tracking-widest ${subTextColor}`}>Status: {syncing ? 'Synchronizing...' : 'Synchronized'}</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Internal Components
const AdminStatCard = ({ label, value, icon, color, isDarkMode }) => {
    const colors = { blue: 'text-blue-500 bg-blue-500/10', emerald: 'text-emerald-500 bg-emerald-500/10', rose: 'text-rose-500 bg-rose-500/10' };
    return (
        <motion.div whileHover={{ y: -5 }} className={`p-8 rounded-[2.5rem] border transition-all duration-500 group relative overflow-hidden ${isDarkMode ? 'bg-[#1e293b]/50 border-white/10 shadow-2xl' : 'bg-white border-slate-100 shadow-xl'}`}>
            <div className="relative z-10 flex justify-between items-center">
                <div>
                    <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] mb-2">{label}</p>
                    <h3 className={`text-5xl font-black tracking-tighter ${isDarkMode ? 'text-slate-50' : 'text-slate-800'}`}>{value}</h3>
                </div>
                <div className={`p-5 rounded-3xl transition-all duration-500 ${colors[color]} group-hover:scale-110 group-hover:rotate-12`}>{icon}</div>
            </div>
        </motion.div>
    );
};

const QuickLink = ({ icon, label, isDarkMode, onClick }) => (
    <div onClick={onClick} className={`p-5 rounded-2xl border flex items-center gap-4 cursor-pointer transition-all hover:translate-x-1 ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'}`}>
        <div className="text-blue-500">{icon}</div>
        <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{label}</span>
    </div>
);

const ToggleSetting = ({ label, active, onClick, isDark }) => (
    <div className="flex justify-between items-center group cursor-pointer" onClick={onClick}>
        <span className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'}`}>{label}</span>
        <div className={`w-12 h-6 rounded-full relative p-1 transition-colors ${active ? 'bg-blue-600' : isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
            <motion.div animate={{ x: active ? 24 : 0 }} className="w-4 h-4 bg-white rounded-full shadow-md" />
        </div>
    </div>
);

export default AdminDashboard;