import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, User, Briefcase, Mail, Lock, ChevronRight, Sparkles } from 'lucide-react';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        name: "", email: "", password: "", role: "Employee", department: ""
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/register`, formData);
            alert("Registration Successful! Welcome to the Core.");
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.message || "Registration Failed");
        }
    };

    // HIGH-CONTRAST VISIBILITY ENGINE
    const inputClasses = "w-full pl-12 pr-4 py-3 rounded-xl bg-[#161b2c] border border-white/20 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-white font-bold text-sm placeholder-slate-500 shadow-lg";
    const labelClasses = "block text-[11px] font-black text-white mb-2 uppercase tracking-[0.2em] ml-1 drop-shadow-md";

    return (
        <div className="h-screen w-full flex items-center justify-center bg-[#0a0c10] p-4 font-sans relative overflow-hidden">
            {/* Background Geometric Glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#3b82f615_0%,_transparent_70%)] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                // Rectangular shape with rounded edges to match Login UI
                className="max-w-md w-full bg-[#111827] rounded-[2rem] shadow-[0_0_60px_rgba(0,0,0,0.7)] p-8 md:p-10 border border-white/10 relative z-10"
            >
                {/* Compact Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex p-3 bg-blue-600/20 rounded-2xl border border-blue-500/30 text-blue-500 mb-4 shadow-inner">
                        <UserPlus size={28} />
                    </div>
                    <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">
                        System <span className="text-blue-500">Register</span>
                    </h3>
                    <div className="h-1 w-12 bg-blue-600 mx-auto rounded-full mb-2" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative group">
                        <label className={labelClasses}>Full Identity</label>
                        <User className="absolute left-4 top-[42px] text-blue-500/70 group-focus-within:text-blue-400 transition-colors" size={18} />
                        <input type="text" required placeholder="Enter Full Name" className={inputClasses}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>

                    <div className="relative group">
                        <label className={labelClasses}>Corporate Mail</label>
                        <Mail className="absolute left-4 top-[42px] text-blue-500/70 group-focus-within:text-blue-400 transition-colors" size={18} />
                        <input type="email" required placeholder="name@company.com" className={inputClasses}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>

                    <div className="relative group">
                        <label className={labelClasses}>Secure Key</label>
                        <Lock className="absolute left-4 top-[42px] text-blue-500/70 group-focus-within:text-blue-400 transition-colors" size={18} />
                        <input type="password" required placeholder="••••••••" className={inputClasses}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="group">
                            <label className={labelClasses}>Role</label>
                            <div className="relative">
                                <select className="w-full px-4 py-3 rounded-xl bg-[#161b2c] border border-white/20 outline-none focus:border-blue-500 transition-all text-white font-black text-[10px] uppercase appearance-none cursor-pointer"
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                                    <option value="Employee" className="bg-[#111827]">Employee</option>
                                    <option value="Manager" className="bg-[#111827]">Manager</option>
                                    <option value="Admin" className="bg-[#111827]">Admin</option>
                                </select>
                                <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-blue-500 pointer-events-none" size={14} />
                            </div>
                        </div>
                        <div className="relative group">
                            <label className={labelClasses}>Sector</label>
                            <Briefcase className="absolute left-4 top-[42px] text-blue-500/70 group-focus-within:text-blue-400 transition-colors" size={16} />
                            <input type="text" placeholder="e.g. HR" className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#161b2c] border border-white/20 outline-none focus:border-blue-500 transition-all text-white font-bold text-[10px] uppercase"
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
                        </div>
                    </div>

                    <button type="submit" className="w-full py-4 mt-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xs uppercase tracking-[0.3em] shadow-[0_10px_30px_rgba(37,99,235,0.4)] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3">
                        Initialize Access <Sparkles size={16} />
                    </button>
                </form>

                <p className="mt-8 text-center text-slate-200 font-black text-[10px] uppercase tracking-[0.2em]">
                    Access Authorized? <Link to="/login" className="text-blue-500 hover:text-blue-400 transition-colors ml-1 underline underline-offset-4">Login Here</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;