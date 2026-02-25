import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, User, Briefcase, Mail, Lock, ChevronRight } from 'lucide-react';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        name: "", email: "", password: "", role: "Employee", department: ""
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            alert("Registration Successful! Welcome to the Core.");
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.message || "Registration Failed");
        }
    };

    const inputClasses = "w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none transition-all text-white font-bold text-sm placeholder-slate-600";
    const labelClasses = "block text-[9px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em] ml-2";

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0c10] p-4 font-sans relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#4f46e520_0%,_transparent_50%)]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl w-full bg-slate-900/80 backdrop-blur-3xl rounded-[3rem] shadow-2xl p-10 md:p-14 border border-white/10 relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 bg-indigo-600/20 rounded-2xl border border-indigo-500/30 text-indigo-500 mb-6">
                        <UserPlus size={32} />
                    </div>
                    <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">Initialize Account</h3>
                    <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Enter credentials to join system infrastructure</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative group">
                        <label className={labelClasses}>Full Legal Name</label>
                        <User className="absolute left-5 top-[42px] text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input type="text" required placeholder="AMRIT RAJ" className={inputClasses}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>

                    <div className="relative group">
                        <label className={labelClasses}>Corporate Email</label>
                        <Mail className="absolute left-5 top-[42px] text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input type="email" required placeholder="admin@system.com" className={inputClasses}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>

                    <div className="relative group">
                        <label className={labelClasses}>Access Key</label>
                        <Lock className="absolute left-5 top-[42px] text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input type="password" required placeholder="••••••••" className={inputClasses}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="group">
                            <label className={labelClasses}>System Role</label>
                            <select className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-indigo-500 transition-all text-white font-black text-xs appearance-none cursor-pointer"
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                                <option value="Employee" className="bg-slate-900">Employee</option>
                                <option value="Manager" className="bg-slate-900">Manager</option>
                                <option value="Admin" className="bg-slate-900">Admin</option>
                            </select>
                        </div>
                        <div className="relative group">
                            <label className={labelClasses}>Sector</label>
                            <Briefcase className="absolute left-5 top-[42px] text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={16} />
                            <input type="text" placeholder="IT/HR" className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-indigo-500 transition-all text-white font-bold text-xs"
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
                        </div>
                    </div>

                    <button type="submit" className="w-full py-5 mt-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-3">
                        EXECUTE REGISTRATION <ChevronRight size={18} />
                    </button>
                </form>

                <p className="mt-8 text-center text-slate-600 font-black text-[10px] uppercase tracking-[0.3em]">
                    Already Encrypted? <Link to="/login" className="text-indigo-500 hover:text-indigo-400">Login to Core</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;