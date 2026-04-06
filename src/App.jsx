import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import PropertyDetails from './pages/PropertyDetails';
import AddProperty from './pages/AddProperty';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import MyBookings from './pages/MyBookings';
import EditProperty from './pages/EditProperty';

const Search = () => (
  <div className="p-4 bg-slate-50 min-h-[100vh]">
    <h1 className="text-2xl font-bold mt-8">Search Properties</h1>
    <p className="mt-2 text-secondary">Browse listings</p>
  </div>
);

const MainLayout = ({ children }) => (
  <>
    <main className="flex-1 pb-20 overflow-y-auto w-full">
      {children}
    </main>
    <Navigation />
  </>
);

function AppRoutes() {
  const { user } = useAuth();

  return (
    <div className="app-container">
      <Routes>

        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />

        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout><Home /></MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/property/:id" element={
          <ProtectedRoute>
            <PropertyDetails />
          </ProtectedRoute>
        } />

        <Route path="/add" element={
          <ProtectedRoute>
            <MainLayout><AddProperty /></MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <MainLayout><Profile /></MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute>
            <MainLayout><AdminPanel /></MainLayout>
          </ProtectedRoute>
        } />

        {/* 🔥 BOOKINGS */}
        <Route path="/my-bookings" element={
          <ProtectedRoute>
            <MainLayout><MyBookings /></MainLayout>
          </ProtectedRoute>
        } />

        {/* 🔥 EDIT PROPERTY */}
        <Route path="/edit/:id" element={
          <ProtectedRoute>
            <MainLayout><EditProperty /></MainLayout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;