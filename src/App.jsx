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

// Page placeholders
// const Home = () => <div className="p-4"><h1 className="text-2xl font-bold">Home Page</h1><p className="mt-2 text-secondary">Find your dream property</p></div>;
const Search = () => (
  <div className="p-4 bg-slate-50 min-h-[100vh]">
    <h1 className="text-2xl font-bold mt-8">Search Properties</h1>
    <p className="mt-2 text-secondary">Browse listings</p>
    <div className="mt-4 p-8 bg-white rounded-2xl border border-slate-100 text-center">
      <p className="text-slate-500">Advanced search features coming soon...</p>
    </div>
  </div>
);
// const AddProperty = () => <div className="p-4"><h1 className="text-2xl font-bold">Add Property</h1><p className="mt-2 text-secondary">List a new property</p></div>;
// const Profile = () => <div className="p-4"><h1 className="text-2xl font-bold">Profile</h1><p className="mt-2 text-secondary">Your account details</p></div>;

// Layout with Navigation
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
        {/* Public Routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />

        {/* Protected Routes */}
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
        <Route path="/search" element={
          <ProtectedRoute>
            <MainLayout><Search /></MainLayout>
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

        {/* Fallback */}
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
