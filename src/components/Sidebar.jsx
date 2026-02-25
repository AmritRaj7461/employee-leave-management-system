import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarBg = isDarkMode ? 'bg-[#0f172a] border-r border-white/5' : 'bg-white border-r border-slate-100';
  const textColor = isDarkMode ? 'text-white' : 'text-slate-800';
  const activeItem = 'bg-blue-600 text-white shadow-lg shadow-blue-600/20';
  const inactiveItem = isDarkMode ? 'text-slate-400 hover:bg-white/5' : 'text-slate-500 hover:bg-slate-50';

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={22} />, path: '/dashboard', roles: ['Employee', 'Manager', 'Admin'] },
    { name: 'Apply Leave', icon: <FilePlus size={22} />, path: '/apply-leave', roles: ['Employee', 'Manager', 'Admin'] },
    { name: 'Reimbursement', icon: <IndianRupee size={22} />, path: '/reimbursement', roles: ['Employee', 'Manager', 'Admin'] },
    { name: 'Approvals', icon: <CheckSquare size={22} />, path: '/approvals', roles: ['Manager', 'Admin'] },
    { name: 'Admin Panel', icon: <Users size={22} />, path: '/admin', roles: ['Admin'] },
  ];

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 90 : 280 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      // h-screen and sticky keep it from scrolling with the page
      className={`h-screen sticky top-0 flex flex-col transition-colors duration-500 z-50 ${sidebarBg}`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`absolute -right-4 top-10 w-8 h-8 rounded-full border flex items-center justify-center transition-all z-[60] ${isDarkMode ? 'bg-slate-800 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-600'
          } shadow-xl hover:scale-110`}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className={`p-8 mb-4 flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'}`}>
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-white shadow-xl shadow-blue-600/40">
            {user?.role?.charAt(0)}
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }} className="absolute -top-1 -right-1">
                <Sparkles size={14} className="text-yellow-500 animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} className="whitespace-nowrap overflow-hidden">
              <h1 className={`text-lg font-black tracking-tighter leading-none ${textColor}`}>{user?.role} Portal</h1>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">Systems Core</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          if (!item.roles.includes(user?.role)) return null;
          const isActive = location.pathname === item.path;
          return (
            <div key={item.name} className="relative group">
              <Link to={item.path} className={`flex items-center rounded-2xl transition-all duration-300 h-14 overflow-hidden ${isCollapsed ? 'justify-center' : 'px-5 gap-4'} ${isActive ? activeItem : inactiveItem}`}>
                <span className={`flex-shrink-0 ${isActive ? 'text-white' : 'group-hover:text-blue-500'}`}>{item.icon}</span>
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.2 }} className="text-sm font-black uppercase tracking-widest whitespace-nowrap">
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
              {/* TOOLTIP ON HOVER */}
              {isCollapsed && (
                <div className={`absolute left-full ml-4 px-4 py-2 shadow-[0_0_20px_rgba(79,70,229,0.2)] ${isDarkMode
                  ? 'bg-indigo-600 text-white border-white/20'
                  : 'bg-slate-900 text-white border-slate-700'
                  } text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-[100] border`}>
                  {item.name}
                  {/* Arrow */}
                  <div className={`absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-900'}`}></div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* FOOTER SECTION: Fixed at bottom within screen height */}
      <div className={`p-4 border-t ${isDarkMode ? 'border-white/5' : 'border-slate-50'}`}>
        <button
          onClick={logout}
          className={`w-full flex items-center rounded-2xl transition-all h-14 text-rose-500 bg-rose-500/5 hover:bg-rose-500/10 overflow-hidden ${isCollapsed ? 'justify-center' : 'px-5 gap-4'}`}
        >
          <LogOut size={20} className="flex-shrink-0" />
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap">
                Terminate
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;