import React from 'react';
import { Sparkles, Zap, ShieldCheck, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const AIInsight = ({ stats, history, nextHoliday }) => {
    // Logic Engine: Generates tactical insights based on user data patterns
    const generateInsight = () => {
        const balance = stats.balance;
        const recentRequests = history.length;
        const rejectedCount = history.filter(h => h.status === 'Rejected').length;

        // Path A: High Balance & Upcoming Holiday
        if (balance > 7 && nextHoliday) {
            return {
                title: "Efficiency Protocol",
                msg: `Tactical opportunity detected: You have a high balance (${balance} days). Pair a request with ${nextHoliday.name} on ${nextHoliday.date} ${nextHoliday.month} for a 4-day bridge.`,
                icon: <Zap size={18} className="text-yellow-400" />,
                color: "border-yellow-500/20 bg-yellow-500/5",
                tag: "Optimization"
            };
        }

        // Path B: High Rejection Pattern
        if (rejectedCount >= 2) {
            return {
                title: "Policy Alignment",
                msg: "Multiple rejections detected. System suggests reviewing 'Sector Policies' or consulting your Manager before the next submission to ensure alignment.",
                icon: <AlertTriangle size={18} className="text-rose-400" />,
                color: "border-rose-500/20 bg-rose-500/5",
                tag: "Security"
            };
        }

        // Path C: Burnout Risk (No history)
        if (recentRequests === 0) {
            return {
                title: "Wellness Guard",
                msg: "Zero recent downtime detected. Operational fatigue may impact long-term output. System recommends scheduling a 1-day 'Recovery Sync' soon.",
                icon: <ShieldCheck size={18} className="text-emerald-400" />,
                color: "border-emerald-500/20 bg-emerald-500/5",
                tag: "Maintenance"
            };
        }

        // Default: Stable State
        return {
            title: "Core Status",
            msg: "All workforce parameters are within optimal range. No tactical actions required at this timestamp.",
            icon: <Sparkles size={18} className="text-blue-400" />,
            color: "border-blue-500/20 bg-blue-500/5",
            tag: "Nominal"
        };
    };

    const insight = generateInsight();

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center gap-4 p-4 rounded-2xl border ${insight.color} transition-all duration-500 group`}
        >
            <div className="flex-shrink-0 p-2 bg-white/5 rounded-xl border border-white/10 group-hover:scale-110 transition-transform">
                {insight.icon}
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">{insight.title}</span>
                    <span className="text-[7px] font-black bg-white/10 text-white/60 px-1.5 py-0.5 rounded uppercase">{insight.tag}</span>
                </div>
                <p className="text-[11px] font-bold text-slate-400 leading-tight group-hover:text-slate-200 transition-colors">
                    {insight.msg}
                </p>
            </div>
        </motion.div>
    );
};

export default AIInsight;