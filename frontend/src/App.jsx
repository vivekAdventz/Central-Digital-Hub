import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './config/msalConfig';

// Context
import { AuthProvider } from './context/AuthContext';

// Components
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import UserDashboard from './pages/user/UserDashboard';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardManagement from './pages/admin/DashboardManagement';
import UserManagement from './pages/admin/UserManagement';

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

const App = () => {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            {/* Public Login Routes */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected User Dashboard */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Protected Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              {/* Redirect /admin to /admin/dashboards */}
              <Route index element={<Navigate to="/admin/dashboards" replace />} />
              <Route path="dashboards" element={<DashboardManagement />} />
              <Route path="users" element={<UserManagement />} />
            </Route>

            {/* Fallback routing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </MsalProvider>
  );
};

export default App;
