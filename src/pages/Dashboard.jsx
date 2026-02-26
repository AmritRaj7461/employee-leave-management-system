// src/pages/Dashboard.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import EmployeeDashboard from './EmployeeDashboard';
import ManagerDashboard from './ManagerDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    // DEBUG: Add this line to see exactly what role React sees
    console.log("Current Logged-in Role:", user?.role);

    if (user?.role === 'Admin') {
        return <AdminDashboard />;
    }

    if (user?.role === 'Manager') {
        return <ManagerDashboard />;
    }

    return <EmployeeDashboard />;
};

export default Dashboard;