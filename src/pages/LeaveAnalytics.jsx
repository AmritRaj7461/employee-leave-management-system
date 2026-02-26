import React, { useState, useEffect, useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ThemeContext } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { Activity, Zap, TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';
import axios from 'axios';

const LeaveAnalytics = () => {
    const { isDarkMode } = useContext(ThemeContext);
    const [chartData, setChartData] = useState([]);

    // Theme Engine
    const isDark = isDarkMode;
    const bgColor = isDark ? 'bg-[#0f172a]' : 'bg-slate-50';
    const cardBg = isDark ? 'bg-[#1e293b]/50 border-white/10 shadow-2xl' : 'bg-white border-slate-200 shadow-xl';
    const textColor = isDark ? 'text-slate-50' : 'text-slate-800';

    useEffect(() => {
        const fetchAnalytics = async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/leaves/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Logic to group leaves by month
            const processed = res.data.reduce((acc, curr) => {
                const month = new Date(curr.fromDate).toLocaleString('default', { month: 'short' });
                acc[month] = (acc[month] || 0) + 1;
                return acc;
            }, {});
            setChartData(Object.keys(processed).map(key => ({ name: key, total: processed[key] })));
        };
        fetchAnalytics();
    }, []);

    return (
        <div className={`min-h-screen ${bgColor} p-6 md:p-10 transition-all duration-500`}>
            <div className="max-w-7xl mx-auto space-y-10">
                <header>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">Neural Engine Active</span>
                    </div>
                    <h1 className={`text-4xl font-black tracking-tight ${textColor}`}>System <span className="text-blue-600 italic">Intelligence</span></h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Burn Velocity Chart */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`lg:col-span-8 p-10 rounded-[3rem] border ${cardBg}`}>
                        <div className="flex items-center gap-3 mb-8">
                            <Activity className="text-indigo-500" size={20} />
                            <h3 className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Leave Density</h3>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#ffffff05" : "#00000005"} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12, fontWeight: 900 }} />
                                    <YAxis hide />
                                    <Tooltip cursor={{ fill: isDark ? '#ffffff05' : '#00000005' }} contentStyle={{ borderRadius: '16px', border: 'none', fontWeight: '900' }} />
                                    <Bar dataKey="total" fill="#4f46e5" radius={[10, 10, 10, 10]} barSize={50} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* AI Predictions */}
                    <div className="lg:col-span-4 space-y-8">
                        <InsightCard theme={isDark ? 'dark' : 'light'} icon={<Zap className="text-amber-500" />} label="Staffing Risk" value="Low" desc="System predicts 98% coverage for next month." />
                        <InsightCard theme={isDark ? 'dark' : 'light'} icon={<AlertTriangle className="text-rose-500" />} label="Burnout Alert" value="2 Members" desc="Ayush and Kunal haven't taken a break in 90 days." />
                    </div>
                </div>
            </div>
        </div>
    );
};

const InsightCard = ({ theme, icon, label, value, desc }) => (
    <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 ${theme === 'dark' ? 'bg-[#1e293b]/50 border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-xl'}`}>
        <div className="flex items-center gap-4 mb-4">
            <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-50'}`}>{icon}</div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</p>
                <h4 className={`text-xl font-black italic tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{value}</h4>
            </div>
        </div>
        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{desc}</p>
    </div>
);

export default LeaveAnalytics;