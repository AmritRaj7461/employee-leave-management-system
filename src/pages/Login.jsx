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

            if (res.data.user.role === 'Admin') navigate('/admin');
            else if (res.data.user.role === 'Manager') navigate('/approvals');
            else navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || "Login Failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 font-sans relative overflow-hidden">
            {/* Background Decorative Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-5xl w-full bg-slate-900/50 backdrop-blur-2xl rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col md:flex-row overflow-hidden border border-white/10 relative z-10"
            >
                {/* Left: Brand Section */}
                <div className="hidden md:flex w-5/12 bg-gradient-to-br from-blue-600 to-indigo-800 p-12 flex-col justify-between text-white relative">
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                                <ShieldCheck size={28} />
                            </div>
                            <h1 className="text-xl font-black italic tracking-tighter uppercase">Leave<span className="text-blue-200">Pro.</span></h1>
                        </div>
                        <h2 className="text-5xl font-black leading-none tracking-tighter mb-6 italic uppercase">Next Gen <br /> Workforce <br /> Tracking.</h2>
                        <p className="text-blue-100/70 font-medium text-lg leading-relaxed">
                            Experience the future of employee management with real-time approvals and system intelligence.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                            <Sparkles size={20} className="text-yellow-400" />
                            <span className="text-xs font-black uppercase tracking-widest">AI-Driven Leave Insights</span>
                        </div>
                    </div>
                </div>

                {/* Right: Login Form */}
                <div className="w-full md:w-7/12 p-8 md:p-16 flex flex-col justify-center bg-transparent">
                    <div className="mb-10 text-center md:text-left">
                        <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2 italic">WELCOME BACK</h3>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Authorization Required to Access Portal</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Secure Identifier</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all text-white font-bold"
                                    placeholder="yourname@corp.com"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Access Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all text-white font-bold"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <button type="submit" className="group w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-lg shadow-2xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3">
                            AUTHORIZE SESSION <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </form>

                    <p className="mt-10 text-center text-slate-500 font-bold text-xs uppercase tracking-widest">
                        New Entity? <Link to="/register" className="text-blue-500 hover:text-blue-400 transition-colors">Register for Access</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;