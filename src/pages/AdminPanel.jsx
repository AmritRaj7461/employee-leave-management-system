import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
    ShieldCheck, User as UserIcon, Settings,
    X, Search, Sparkles, Sun, Moon,
    MoreHorizontal, Fingerprint, Trash2, ArrowUpCircle, Activity
} from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPanel = () => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [activeMenuId, setActiveMenuId] = useState(null);

    const [config, setConfig] = useState({
        strictRoleValidation: true,
        mfaEnabled: false,
        autoApproveManagers: false
    });

    const isDark = isDarkMode;
    const bgColor = isDark ? 'bg-[#0f172a]' : 'bg-slate-50';
    const cardBg = isDark ? 'bg-[#1e293b]/50 border-white/10 shadow-2xl backdrop-blur-xl' : 'bg-white border-slate-200 shadow-xl';
    const textColor = isDark ? 'text-slate-50' : 'text-slate-800';
    const subTextColor = isDark ? 'text-indigo-200/60' : 'text-slate-500';

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
        } catch (err) {
            console.error("Critical Admin Sync Failure");
        }
    };

    useEffect(() => { fetchData(); }, []);

    const updateGlobalConfig = async (newConfig) => {
        // Optimistic Update
        setConfig(newConfig);
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/admin/config', newConfig, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Final sync after backend confirms
            fetchData();
        } catch (err) {
            console.error("Sync failed.");
        }
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`min-h-screen transition-all duration-500 ${bgColor} p-6 md:p-10 font-sans relative overflow-hidden`}>
            {/* Background Glow */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-10 relative z-10">
                <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-600/10 text-blue-500 flex items-center gap-2">
                                <ShieldCheck size={14} /> Security Protocol Active
                            </div>
                        </div>
                        <h1 className={`text-5xl font-black tracking-tighter ${textColor}`}>System <span className="text-blue-600 italic">Control</span></h1>
                        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                            <span className="flex items-center gap-1"><Activity size={14} className="text-emerald-500" /> {users.length} Active Entities</span>
                            <span className="w-1 h-1 bg-slate-400 rounded-full" />
                            <span>MFA: {config.mfaEnabled ? 'Enabled' : 'Disabled'}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className={`relative flex items-center px-4 py-2 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10 focus-within:border-blue-500' : 'bg-white border-slate-200 focus-within:border-blue-600 shadow-sm'}`}>
                            <Search size={18} className="text-slate-500" />
                            <input type="text" placeholder="Trace identity..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent border-none outline-none pl-3 font-bold text-sm text-slate-400 placeholder:text-slate-600 w-48" />
                        </div>
                        <button onClick={toggleTheme} className={`p-4 rounded-2xl shadow-xl transition-all border ${isDark ? 'bg-slate-800 border-slate-700 text-yellow-400' : 'bg-white border-slate-100 text-slate-600'}`}>
                            {isDark ? <Sun size={22} /> : <Moon size={22} />}
                        </button>
                        <button onClick={() => setIsSettingsOpen(true)} className="p-4 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all">
                            <Settings size={22} />
                        </button>
                    </div>
                </header>

                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-20">
                    <AnimatePresence mode="popLayout">
                        {filteredUsers.map((u) => (
                            <motion.div key={u._id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} whileHover={{ y: -10 }} className={`p-8 rounded-[3.5rem] border group transition-all duration-500 relative ${cardBg}`}>
                                {/* Action Menu */}
                                <div className="absolute top-8 right-8">
                                    <button onClick={() => setActiveMenuId(activeMenuId === u._id ? null : u._id)} className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10 text-slate-600' : 'hover:bg-slate-50 text-slate-400'}`}><MoreHorizontal size={24} /></button>
                                    <AnimatePresence>
                                        {activeMenuId === u._id && (
                                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className={`absolute right-0 mt-2 w-48 rounded-2xl shadow-2xl border z-[100] overflow-hidden ${isDark ? 'bg-slate-800 border-white/10' : 'bg-white border-slate-100'}`}>
                                                <button onClick={() => handlePromoteUser(u)} className={`w-full flex items-center gap-3 px-5 py-4 text-[10px] font-black uppercase hover:bg-blue-600/10 ${textColor}`}><ArrowUpCircle size={16} className="text-emerald-500" /> Elevate Role</button>
                                                <button onClick={() => handleDeleteUser(u._id)} className="w-full flex items-center gap-3 px-5 py-4 text-[10px] font-black uppercase text-rose-500 hover:bg-rose-500/10"><Trash2 size={16} /> Delete Identity</button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="flex flex-col gap-6">
                                    <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-3xl font-black shadow-inner ${isDark ? 'bg-white/5 text-slate-300' : 'bg-slate-100 text-slate-400'}`}>{u.name?.charAt(0)}</div>
                                    <div>
                                        <h3 className={`text-2xl font-black tracking-tighter ${textColor}`}>{u.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${u.role === 'Admin' ? 'bg-indigo-500/20 text-indigo-500' : 'bg-blue-500/10 text-blue-500'}`}>{u.role}</span>
                                            {config.autoApproveManagers && u.role === 'Manager' && (
                                                <span className="px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Auto-Pass</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className={`pt-6 border-t flex items-center justify-between ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Fingerprint size={16} />
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{u.department || 'General Ops'}</span>
                                        </div>
                                        {u.role === 'Admin' ? <ShieldCheck className="text-indigo-500" size={24} /> : <UserIcon className="text-slate-300 opacity-40" size={24} />}
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
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSettingsOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30 }} className={`relative w-full max-w-md h-full p-12 flex flex-col border-l ${isDark ? 'bg-[#0f172a] border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]' : 'bg-white border-slate-100 shadow-2xl'}`}>
                            <div className="flex justify-between items-center mb-16">
                                <div>
                                    <h2 className={`text-3xl font-black italic tracking-tighter ${textColor}`}>GLOBAL ENGINE</h2>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Platform Core Settings</p>
                                </div>
                                <button onClick={() => setIsSettingsOpen(false)} className={`${textColor} p-2 hover:bg-rose-500/10 rounded-full transition-all`}><X size={32} /></button>
                            </div>
                            <div className="space-y-12">
                                <div className="space-y-8">
                                    <ToggleSetting label="Strict Role Validation" active={config.strictRoleValidation} onClick={() => updateGlobalConfig({ ...config, strictRoleValidation: !config.strictRoleValidation })} isDark={isDark} />
                                    <ToggleSetting label="Manager Auto-Approval" active={config.autoApproveManagers} onClick={() => updateGlobalConfig({ ...config, autoApproveManagers: !config.autoApproveManagers })} isDark={isDark} />
                                    <ToggleSetting label="Force MFA Identity" active={config.mfaEnabled} onClick={() => updateGlobalConfig({ ...config, mfaEnabled: !config.mfaEnabled })} isDark={isDark} />
                                </div>
                                <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-indigo-500/5 border-indigo-500/10' : 'bg-slate-50 border-slate-200'}`}>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 italic">Security Log</p>
                                    <p className={`text-xs font-bold leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Current auto-approval setting skips manual review for all accounts designated with <span className="text-blue-600">Manager</span> clearance level.</p>
                                </div>
                                <button className="w-full py-6 rounded-3xl bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-indigo-600/30 active:scale-95 transition-all">Emergency Lockout</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ToggleSetting = ({ label, active, onClick, isDark }) => (
    <div className="flex justify-between items-center group cursor-pointer" onClick={onClick}>
        <span className={`text-xs font-black uppercase tracking-[0.2em] transition-colors ${isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>{label}</span>
        <div className={`w-14 h-7 rounded-full relative p-1.5 transition-all duration-300 ${active ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
            <motion.div animate={{ x: active ? 28 : 0 }} className="w-4 h-4 bg-white rounded-full shadow-lg" />
        </div>
    </div>
);

export default AdminPanel;