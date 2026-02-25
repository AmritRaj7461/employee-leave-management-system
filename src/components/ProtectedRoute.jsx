import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    // Fulfills "Implement loading states in React UI" [cite: 30]
    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-900 text-white font-bold animate-pulse">
                Verifying Permissions...
            </div>
        );
    }

    // Redirect to login if not authenticated 
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Redirect if role is not authorized for this specific route [cite: 33]
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;