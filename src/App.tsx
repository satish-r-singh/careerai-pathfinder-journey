
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Index from './pages/Index';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Introspection from './pages/Introspection';
import Ikigai from './pages/Ikigai';
import IndustryResearch from './pages/IndustryResearch';
import { Toaster } from '@/components/ui/toaster';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/introspection" element={<ProtectedRoute><Introspection /></ProtectedRoute>} />
              <Route path="/ikigai" element={<ProtectedRoute><Ikigai /></ProtectedRoute>} />
              <Route path="/industry-research" element={<ProtectedRoute><IndustryResearch /></ProtectedRoute>} />
            </Routes>
            <Toaster />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
