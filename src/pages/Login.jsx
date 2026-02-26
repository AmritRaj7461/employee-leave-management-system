import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Mail, Lock, ArrowRight } from 'lucide-react';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            login(res.data.user, res.data.token);

            // SYNCED NAVIGATION
            if (res.data.user.role === 'Admin') navigate('/admin-panel');
            else if (res.data.user.role === 'Manager') navigate('/approvals');
            else navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || "Authorization Failed");
        }
    };

    // HIGH-VISIBILITY CLASSES
    const inputClasses = "w-full pl-14 pr-6 py-4 rounded-xl bg-[#161b2c] border border-white/20 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-white font-bold text-sm placeholder-slate-500 shadow-lg";
    const labelClasses = "block text-[11px] font-black text-white mb-2 uppercase tracking-[0.2em] ml-1 drop-shadow-md";

    return (
        <div className="h-screen w-full flex items-center justify-center bg-[#0a0c10] p-4 font-sans relative overflow-hidden">
            {/* Background Geometric Glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#3b82f615_0%,_transparent_70%)] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                // RECTANGULAR GEOMETRY
                className="max-w-5xl w-full bg-[#111827] rounded-[2rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col md:flex-row overflow-hidden border border-white/10 relative z-10"
            >
                {/* Left: Brand Insight Section */}
                <div className="hidden md:flex w-5/12 bg-gradient-to-br from-blue-600 to-indigo-800 p-12 flex-col justify-between text-white relative">
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                                <ShieldCheck size={28} className="text-white" />
                            </div>
                            <h1 className="text-xl font-black italic tracking-tighter uppercase">Leave<span className="text-blue-300">Core.</span></h1>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-5xl font-black leading-none tracking-tighter italic uppercase drop-shadow-lg">
                                Authorize <br /> Access <br /> Protocol.
                            </h2>
                            <p className="text-blue-100/70 font-medium text-lg leading-relaxed max-w-xs">
                                Secure gateway to the workforce tracking system and AI analytics.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <Sparkles size={20} className="text-yellow-400 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest">AI-Driven Insights Active</span>
                        </div>
                    </div>
                </div>

                {/* Right: Authorization Form */}
                <div className="w-full md:w-7/12 p-10 md:p-16 flex flex-col justify-center bg-transparent">
                    <div className="mb-10 text-center md:text-left">
                        <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2 italic">WELCOME BACK</h3>
                        <div className="h-1 w-12 bg-blue-600 rounded-full mb-3" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Identity Verification Required</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative group">
                            <label className={labelClasses}>Secure Identifier</label>
                            <Mail className="absolute left-5 top-[42px] text-blue-500/70 group-focus-within:text-blue-400 transition-colors" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className={inputClasses}
                                placeholder="name@company.com"
                            />
                        </div>

                        <div className="relative group">
                            <label className={labelClasses}>Access Key</label>
                            <Lock className="absolute left-5 top-[42px] text-blue-500/70 group-focus-within:text-blue-400 transition-colors" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className={inputClasses}
                                placeholder="••••••••"
                            />
                        </div>

                        <button type="submit" className="group w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-sm uppercase tracking-[0.3em] shadow-[0_15px_30px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-3 active:scale-95">
                            Authorize Session <ArrowRight className="group-hover:translate-x-2 transition-transform" size={18} />
                        </button>
                    </form>

                    <p className="mt-10 text-center text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">
                        New Entity? <Link to="/register" className="text-blue-500 hover:text-blue-400 transition-colors underline underline-offset-4">Register for Access</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;