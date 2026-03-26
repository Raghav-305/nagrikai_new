import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateComplaint from './pages/CreateComplaint';
import ComplaintsList from './pages/ComplaintsList';
import DepartmentDashboard from './pages/DepartmentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { initializeTheme } from './utils/theme';
import './styles/global.css';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

          {/* Citizen Routes */}
          <Route
            path="/create-complaint"
            element={
              <ProtectedRoute requiredRole="citizen">
                <CreateComplaint />
              </ProtectedRoute>
            }
          />
          <Route
            path="/complaints"
            element={
              <ProtectedRoute requiredRole="citizen">
                <ComplaintsList />
              </ProtectedRoute>
            }
          />

          {/* Officer Routes */}
          <Route
            path="/department"
            element={
              <ProtectedRoute requiredRole="officer">
                <DepartmentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

function App() {
  useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
