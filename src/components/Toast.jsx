import React from 'react';
import { CheckCircle, XCircle, Bell } from 'lucide-react';

const Toast = ({ message, type, onClose }) => {
    return (
        <div className="fixed top-10 right-10 z-[100] animate-bounce">
            <div className="bg-white border border-slate-100 shadow-2xl p-6 rounded-[2rem] flex items-center gap-4 min-w-[300px]">
                <div className={`p-3 rounded-2xl ${type === 'Approved' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                    {type === 'Approved' ? <CheckCircle size={24} /> : <XCircle size={24} />}
                </div>
                <div className="flex-1">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Update</p>
                    <p className="font-bold text-slate-700">{message}</p>
                </div>
                <button onClick={onClose} className="text-slate-300 hover:text-slate-500 font-bold">Close</button>
            </div>
        </div>
    );
};

export default Toast;