import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';

// Components & UI
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Toast from './components/Toast';

// Page Imports
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ApplyLeave from './pages/ApplyLeave';
import Reimbursement from './pages/Reimbursement';
import AdminPanel from './pages/AdminPanel';
import Approvals from './pages/Approvals';

const AppLayout = ({ children, notification, onCloseToast }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="flex">
      {/* Toast Notification positioned globally */}
      {notification && (
        <Toast
          message={notification.message}
          type={notification.type}
          onClose={onCloseToast}
        />
      )}

      {!isAuthPage && <Sidebar />}
      <div className={`flex-1 min-h-screen ${!isAuthPage ? 'bg-slate-50' : 'bg-white'}`}>
        {children}
      </div>
    </div>
  );
};

function App() {
  const { user } = useContext(AuthContext);
  const [notification, setNotification] = useState(null);

  // Function to fetch unseen approvals/rejections from the backend
  const checkNotifications = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem('token');
      // This endpoint should return items where status != 'Pending' and notified == false
      const res = await axios.get('http://localhost:5000/api/notifications/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.updates && res.data.updates.length > 0) {
        const item = res.data.updates[0]; // Process the first unread update
        setNotification({
          id: item._id,
          type: item.status, // 'Approved' or 'Rejected'
          message: `Your ${item.category} request has been ${item.status}!`,
          category: item.category // 'Leave' or 'Expense'
        });
      }
    } catch (err) {
      console.error("Notification polling failed", err);
    }
  };

  // Poll for notifications every 15 seconds while logged in
  useEffect(() => {
    if (user) {
      checkNotifications();
      const interval = setInterval(checkNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Handle closing the toast and marking it as 'notified' in the DB
  const handleCloseToast = async () => {
    if (!notification) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/notifications/mark-seen', {
        id: notification.id,
        category: notification.category
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotification(null);
    } catch (err) {
      console.error("Failed to mark notification as seen");
      setNotification(null); // Close it anyway to avoid stuck UI
    }
  };

  return (
    <BrowserRouter>
      <AppLayout notification={notification} onCloseToast={handleCloseToast}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Role-Based Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['Employee', 'Manager', 'Admin']}>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/apply-leave" element={
            <ProtectedRoute allowedRoles={['Employee', 'Manager', 'Admin']}>
              <ApplyLeave />
            </ProtectedRoute>
          } />

          <Route path="/reimbursement" element={
            <ProtectedRoute allowedRoles={['Employee', 'Manager', 'Admin']}>
              <Reimbursement />
            </ProtectedRoute>
          } />

          <Route path="/approvals" element={
            <ProtectedRoute allowedRoles={['Manager', 'Admin']}>
              <Approvals />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminPanel />
            </ProtectedRoute>
          } />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;