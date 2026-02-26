import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Bell, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ message, type, onClose }) => {
    // Auto-close after 6 seconds
    useEffect(() => {
        const timer = setTimeout(onClose, 6000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const isApproved = type === 'Approved';

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, x: 20, transition: { duration: 0.2 } }}
            // FIX: Ensure the container specifically allows pointer events for its children
            className="fixed top-8 right-8 z-[10000] pointer-events-auto"
        >
            <div className={`relative overflow-hidden group min-w-[400px] p-[2px] rounded-[2.5rem] bg-gradient-to-br ${isApproved
                ? 'from-emerald-500/40 to-teal-500/10'
                : 'from-rose-500/40 to-orange-500/10'
                } backdrop-blur-2xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.5)]`}>

                {/* Decorative background glow */}
                <div className={`absolute -right-10 -top-10 w-32 h-32 blur-3xl opacity-30 rounded-full ${isApproved ? 'bg-emerald-500' : 'bg-rose-500'
                    }`} />

                <div className="bg-[#0f172a]/90 rounded-[2.4rem] p-6 flex items-center gap-5 relative z-10">

                    {/* Status Icon Core */}
                    <div className="relative shrink-0">
                        <div className={`p-4 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:scale-110 ${isApproved
                            ? 'bg-emerald-500 text-white shadow-emerald-500/40'
                            : 'bg-rose-500 text-white shadow-rose-500/40'
                            }`}>
                            {isApproved ? <CheckCircle size={28} strokeWidth={3} /> : <XCircle size={28} strokeWidth={3} />}
                        </div>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-1 -right-1 text-yellow-400"
                        >
                            <Sparkles size={14} />
                        </motion.div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-black uppercase tracking-[0.25em] ${isApproved ? 'text-emerald-400' : 'text-rose-400'
                                }`}>
                                Protocol Update
                            </span>
                            <div className="h-1 w-1 rounded-full bg-slate-600" />
                            <Bell size={12} className="text-slate-500 animate-bounce" />
                        </div>
                        <p className="text-sm font-bold text-slate-100 leading-snug pr-2">
                            {message}
                        </p>
                    </div>

                    {/* FIXED: Close Button with z-index and explicit click handling */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onClose();
                        }}
                        className="relative z-50 p-3 rounded-xl bg-white/5 hover:bg-white/20 text-slate-400 hover:text-white transition-all active:scale-90 border border-white/5"
                    >
                        <X size={20} strokeWidth={3} />
                    </button>
                </div>

                {/* Progress Bar */}
                <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 6, ease: "linear" }}
                    className={`h-1.5 absolute bottom-0 left-0 ${isApproved ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                />
            </div>
        </motion.div>
    );
};

export default Toast;