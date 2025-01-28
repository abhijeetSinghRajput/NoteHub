import React, { useEffect } from 'react'
import { ThemeProvider } from "./components/theme-provider";
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/useAuthStore';
import { Toaster } from 'sonner';

import Navbar from './components/Navbar';

//Pages
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import EmailVerificationPage from './pages/EmailVerificationPage';

import { Loader } from 'lucide-react';
import Dashboard from './pages/dashboard';
import ForgetPasswordPage from './pages/ForgetPasswordPage';


function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='animate-spin' />
      </div>
    )
  }

  console.log({authUser});

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div>
        <Routes>
          <Route path='/verify-email' element={!authUser?.isEmailVerified ? <EmailVerificationPage /> : <Navigate to='/' />} />
          <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
          <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
          <Route path='/settings' element={<SettingsPage />} />
          <Route path='/forget-password' element={<ForgetPasswordPage />} />


          {/* Nested routes inside Dashboard */}
          <Route path="/" element={authUser ? <Dashboard /> : <Navigate to="/login" />}>
            <Route index element={<HomePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

        </Routes>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;