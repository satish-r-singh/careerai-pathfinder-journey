
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Header from './components/Header';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Introspection from './pages/Introspection';
import Ikigai from './pages/Ikigai';
import IndustryResearch from './pages/IndustryResearch';
import { Toaster } from '@/components/ui/toaster';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Header />
            <main>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/introspection" element={<ProtectedRoute><Introspection /></ProtectedRoute>} />
                <Route path="/ikigai" element={<ProtectedRoute><Ikigai /></ProtectedRoute>} />
                <Route path="/industry-research" element={<ProtectedRoute><IndustryResearch /></ProtectedRoute>} />
              </Routes>
            </main>
            <Toaster />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
