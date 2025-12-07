
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PaymentPage from './components/PaymentPage';
import SchedulePage from './components/SchedulePage';
import MaterialsPage from './components/MaterialsPage';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import AdmissionPage from './components/AdmissionPage';
import { Student } from './types';
import { DataProvider } from './contexts/DataContext';

const AppContent: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const [isSessionChecking, setIsSessionChecking] = useState<boolean>(true);

  useEffect(() => {
    // Check for existing session
    const authStatus = localStorage.getItem('isAuth');
    const storedUser = localStorage.getItem('currentUser');
    
    if (authStatus === 'true' && storedUser) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsSessionChecking(false);
  }, []);

  const handleLogin = (student: Student) => {
    localStorage.setItem('isAuth', 'true');
    localStorage.setItem('currentUser', JSON.stringify(student));
    setIsAuthenticated(true);
    setCurrentUser(student);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuth');
    localStorage.removeItem('currentUser');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const handleUpdateUser = (updatedData: Partial<Student>) => {
    if (currentUser) {
      const newUser = { ...currentUser, ...updatedData };
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setCurrentUser(newUser);
    }
  };

  if (isSessionChecking) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">Loading Session...</div>;
  }

  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          !isAuthenticated ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/payment" replace />
        } />
        <Route path="/register" element={
          !isAuthenticated ? <RegistrationPage /> : <Navigate to="/payment" replace />
        } />

        {/* Protected Routes */}
        <Route path="/" element={
          isAuthenticated && currentUser ? <Layout currentUser={currentUser} onLogout={handleLogout} onUpdateUser={handleUpdateUser} /> : <Navigate to="/login" replace />
        }>
          <Route index element={<Navigate to="/payment" replace />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="materials" element={<MaterialsPage />} />
          <Route path="admission" element={<AdmissionPage />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/payment" : "/login"} replace />} />
      </Routes>
    </HashRouter>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
};

export default App;
