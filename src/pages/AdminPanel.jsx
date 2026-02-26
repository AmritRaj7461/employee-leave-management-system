import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import {
    ShieldCheck, User as UserIcon, Settings,
    X, Search, Sparkles, Sun, Moon,
    MoreHorizontal, Fingerprint, Trash2, ArrowUpCircle, Activity, RefreshCcw
} from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPanel = () => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [activeMenuId, setActiveMenuId] = useState(null);

    const menuRef = useRef(null);
    const settingsRef = useRef(null);

    const [config, setConfig] = useState({
        strictRoleValidation: true,
        mfaEnabled: false,
        autoApproveManagers: false
    });

    const isDark = isDarkMode;
    const bgColor = isDark ? 'bg-[#0b0f1a]' : 'bg-[#f8fafc]';
    const cardBg = isDark ? 'bg-[#161b2c]/60 border-white/5 shadow-xl backdrop-blur-xl' : 'bg-white border-slate-200 shadow-lg';

    // HIGH-CONTRAST TEXT ENGINE
    const textColor = isDark ? 'text-white' : 'text-slate-900';
    const subTextColor = isDark ? 'text-slate-300' : 'text-slate-700';

    // Click Outside Listener
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) setActiveMenuId(null);
            if (settingsRef.current && !settingsRef.current.contains(event.target) && isSettingsOpen) {
                if (!event.target.closest('.settings-toggle-btn')) setIsSettingsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isSettingsOpen]);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const [userRes, configRes] = await Promise.all([
                axios.get('http://localhost:5000/api/auth/users', { headers }),
                axios.get('http://localhost:5000/api/admin/config', { headers }).catch(() => ({ data: config }))
            ]);
            setUsers(userRes.data);
            setConfig(configRes.data);
        } catch (err) { console.error("Admin Sync Offline"); }
    };

    const handlePurge = () => {
        if (window.confirm("Purge all system logs?")) {
            // Execution logic...
            setIsSettingsOpen(false); // Auto-close on action
        }
    };

    const updateGlobalConfig = async (newConfig) => {
        setConfig(newConfig);
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/admin/config', newConfig, { headers: { Authorization: `Bearer ${token}` } });
            fetchData();
        } catch (err) { console.error("Sync failed."); }
    };

    useEffect(() => { fetchData(); }, []);

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`min-h-screen transition-all duration-700 ${bgColor} p-5 md:p-8 lg:p-10 font-sans relative overflow-hidden`}>
            <div className="max-w-7xl mx-auto space-y-10 relative z-10">
                <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                    <div className="space-y-3">
                        <div className="px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] bg-blue-600/10 text-blue-500 w-fit flex items-center gap-2">
                            <ShieldCheck size={12} /> System Admin Mode
                        </div>
                        <h1 className={`text-5xl font-black tracking-tighter ${textColor}`}>Identity <span className="text-blue-500 italic">Vault</span></h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className={`relative flex items-center px-5 py-3 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-md'}`}>
                            <Search size={18} className="text-slate-500" />
                            <input type="text" placeholder="Trace identity..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                className={`bg-transparent border-none outline-none pl-3 font-bold text-sm w-48 ${isDark ? 'text-white placeholder-slate-500' : 'text-slate-800'}`} />
                        </div>
                        <button onClick={toggleTheme} className={`p-4 rounded-2xl border transition-all hover:rotate-12 ${isDark ? 'bg-slate-800 text-yellow-400' : 'bg-white text-slate-600 shadow-sm'}`}>
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button onClick={() => setIsSettingsOpen(true)} className="settings-toggle-btn p-4 rounded-2xl bg-indigo-600 text-white shadow-lg hover:scale-110 active:scale-95 transition-all">
                            <Settings size={20} />
                        </button>
                    </div>
                </header>

                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
                    <AnimatePresence>
                        {filteredUsers.map((u) => (
                            <motion.div key={u._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} whileHover={{ y: -5 }} layout className={`p-6 rounded-[2.5rem] border group relative ${cardBg}`}>
                                <div className="absolute top-6 right-6">
                                    <button onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === u._id ? null : u._id); }}
                                        className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10 text-slate-500' : 'hover:bg-slate-50 text-slate-400'}`}><MoreHorizontal size={20} /></button>
                                    <AnimatePresence>
                                        {activeMenuId === u._id && (
                                            <motion.div ref={menuRef} initial={{ opacity: 0, scale: 0.9, y: 5 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 5 }}
                                                className={`absolute right-0 mt-2 w-44 rounded-2xl shadow-2xl border z-[100] overflow-hidden ${isDark ? 'bg-slate-800 border-white/10' : 'bg-white border-slate-100'}`}>
                                                <button className={`w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase hover:bg-emerald-500/10 ${textColor}`}>
                                                    <ArrowUpCircle size={14} className="text-emerald-500" /> Promote
                                                </button>
                                                <button className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase text-rose-500 hover:bg-rose-500/10">
                                                    <Trash2 size={14} /> Terminate
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="flex flex-col gap-5">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black ${isDark ? 'bg-white/5 text-blue-400 shadow-inner' : 'bg-slate-100 text-slate-500'}`}>{u.name?.charAt(0)}</div>
                                    <div>
                                        <h3 className={`text-xl font-black tracking-tight ${textColor}`}>{u.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${u.role === 'Admin' ? 'bg-indigo-500/20 text-indigo-500' : 'bg-blue-500/10 text-blue-500'}`}>{u.role}</span>
                                        </div>
                                    </div>
                                    <div className={`pt-5 border-t flex items-center justify-between ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                                        <div className="flex items-center gap-2 text-slate-500"><Fingerprint size={14} /><span className={`text-[9px] font-black uppercase tracking-widest ${subTextColor}`}>{u.department || 'CORE'}</span></div>
                                        {u.role === 'Admin' ? <ShieldCheck className="text-indigo-500" size={20} /> : <UserIcon className="text-slate-300 opacity-40" size={20} />}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* --- CONFIGURATION DRAWER --- */}
            <AnimatePresence>
                {isSettingsOpen && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-end">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div ref={settingsRef} initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }}
                            className={`relative w-full max-w-md h-full p-10 flex flex-col border-l ${isDark ? 'bg-[#0f172a] border-white/10' : 'bg-white border-slate-100 shadow-2xl'}`}>
                            <div className="flex justify-between items-center mb-10">
                                <h2 className={`text-2xl font-black tracking-tighter ${textColor}`}>GLOBAL <span className="text-blue-500">CONFIG</span></h2>
                                <button onClick={() => setIsSettingsOpen(false)} className={`${textColor} p-2 hover:bg-rose-500/10 rounded-full transition-all`}><X size={24} /></button>
                            </div>
                            <div className="space-y-10 flex-1">
                                <div className="space-y-6">
                                    <ToggleSetting label="Strict Validation" active={config.strictRoleValidation} onClick={() => updateGlobalConfig({ ...config, strictRoleValidation: !config.strictRoleValidation })} isDark={isDark} />
                                    <ToggleSetting label="Auto-Approval" active={config.autoApproveManagers} onClick={() => updateGlobalConfig({ ...config, autoApproveManagers: !config.autoApproveManagers })} isDark={isDark} />
                                </div>
                            </div>
                            <button onClick={handlePurge} className="w-full py-5 rounded-2xl bg-rose-600/10 text-rose-600 font-black text-[11px] uppercase tracking-[0.3em] hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-3">
                                <RefreshCcw size={16} /> Purge Records
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ToggleSetting = ({ label, active, onClick, isDark }) => (
    <div className="flex justify-between items-center group cursor-pointer p-2 rounded-xl hover:bg-blue-600/5 transition-all" onClick={onClick}>
        <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>{label}</span>
        <div className={`w-12 h-6 rounded-full relative p-1 transition-all ${active ? 'bg-blue-600' : isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
            <motion.div animate={{ x: active ? 24 : 0 }} className="w-4 h-4 bg-white rounded-full shadow-md" />
        </div>
    </div>
);

export default AdminPanel;