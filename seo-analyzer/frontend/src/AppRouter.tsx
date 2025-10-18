import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import LandingPage from './LandingPage';
import Login from './Login';
import SEOTool from './SEOTool';

const API_URL = 'http://localhost:3001/api';

function AppRouterContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const location = useLocation();

  // Check authentication status on app load and when location changes
  useEffect(() => {
    const checkAuth = async () => {
      setAuthLoading(true);
      try {
        const response = await axios.get(`${API_URL}/check-auth`, {
          withCredentials: true
        });
        console.log('Auth check result:', response.data);
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (err) {
        console.error('Auth check failed:', err);
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname]);

  if (authLoading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          isAuthenticated ?
            <Navigate to="/tool" replace /> :
            <Login onLogin={() => setIsAuthenticated(true)} />
        }
      />
      <Route
        path="/tool"
        element={
          isAuthenticated ?
            <SEOTool onLogout={() => setIsAuthenticated(false)} /> :
            <Navigate to="/login" replace />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function AppRouter() {
  return (
    <BrowserRouter>
      <AppRouterContent />
    </BrowserRouter>
  );
}

export default AppRouter;
