import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import {
  LayoutDashboard, FilePlus, IndianRupee,
  CheckSquare, Users, LogOut, Sparkles,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // --- PRECISE THEME MATCHING ---
  // Using the exact deep dark hex from your dashboard video
  const sidebarBg = isDarkMode
    ? 'bg-[#0f172a] border-r border-white/5'
    : 'bg-white border-r border-slate-200';

  const textColor = isDarkMode ? 'text-slate-100' : 'text-slate-900';
  const subText = isDarkMode ? 'text-blue-500' : 'text-blue-600';
  const iconColor = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard', roles: ['Employee', 'Manager', 'Admin'] },
    { name: 'Apply Leave', icon: <FilePlus size={20} />, path: '/apply-leave', roles: ['Employee', 'Manager', 'Admin'] },
    { name: 'Reimbursement', icon: <IndianRupee size={20} />, path: '/reimbursement', roles: ['Employee', 'Manager', 'Admin'] },
    { name: 'Approvals', icon: <CheckSquare size={20} />, path: '/approvals', roles: ['Manager', 'Admin'] },
    { name: 'Admin Panel', icon: <Users size={20} />, path: '/admin-panel', roles: ['Admin'] },
  ];

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 100 : 300 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className={`h-screen sticky top-0 flex flex-col transition-colors duration-500 z-50 ${sidebarBg} shadow-2xl`}
    >
      {/* COLLAPSE TOGGLE */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`absolute -right-4 top-12 w-9 h-9 rounded-xl border flex items-center justify-center transition-all z-[60] ${isDarkMode ? 'bg-[#111827] border-white/10 text-white shadow-blue-900/20' : 'bg-white border-slate-200 text-slate-800 shadow-xl'
          } hover:scale-110 active:scale-95`}
      >
        {isCollapsed ? <ChevronRight size={18} strokeWidth={3} /> : <ChevronLeft size={18} strokeWidth={3} />}
      </button>

      {/* BRANDING / PROFILE */}
      <div className={`p-10 mb-6 flex items-center ${isCollapsed ? 'justify-center' : 'gap-5'}`}>
        <div className="w-14 h-14 bg-gradient-to-br from-blue-700 to-blue-500 rounded-[1.25rem] flex-shrink-0 flex items-center justify-center font-black text-xl text-white shadow-2xl shadow-blue-600/30">
          {user?.role?.charAt(0)}
        </div>

        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: 0.1 }}
              className="whitespace-nowrap overflow-hidden"
            >
              <h1 className={`text-xl font-black tracking-tight leading-none ${textColor}`}>
                {user?.role} <span className="text-blue-500 italic">Portal</span>
              </h1>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${subText}`}>Systems Core</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-6 space-y-3 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          if (!item.roles.includes(user?.role)) return null;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`group flex items-center rounded-2xl transition-all duration-300 h-16 ${isCollapsed ? 'justify-center' : 'px-6 gap-5'
                } ${isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : isDarkMode ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'
                }`}
            >
              <span className={`flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : iconColor}`}>
                {item.icon}
              </span>

              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-xs font-black uppercase tracking-[0.15em] whitespace-nowrap"
                >
                  {item.name}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER SECTION */}
      <div className={`p-8 border-t ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
        <button
          onClick={logout}
          className={`w-full flex items-center rounded-2xl transition-all h-16 text-rose-500 bg-rose-500/5 hover:bg-rose-500/10 ${isCollapsed ? 'justify-center' : 'px-6 gap-5'
            }`}
        >
          <LogOut size={22} className="flex-shrink-0" />
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[11px] font-black uppercase tracking-[0.3em] whitespace-nowrap"
            >
              Log Out
            </motion.span>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;