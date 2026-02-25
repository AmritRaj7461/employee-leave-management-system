import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import EmployeeDashboard from './EmployeeDashboard';
import ManagerDashboard from './ManagerDashboard';
import AdminDashboard from './AdminDashboard'; // Import the new view

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    // Now Admins see a Dashboard, NOT the User Management panel
    if (user?.role === 'Admin') {
        return <AdminDashboard />;
    }

    if (user?.role === 'Manager') {
        return <ManagerDashboard />;
    }

    return <EmployeeDashboard />;
};

export default Dashboard;