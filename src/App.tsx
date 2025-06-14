
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Index from './pages/Index';
import Onboarding from './pages/Onboarding';
import ProtectedRoute from './components/ProtectedRoute';
import Introspection from './pages/Introspection';
import Ikigai from './pages/Ikigai';
import IndustryResearch from './pages/IndustryResearch';
import AICareerIntegration from './pages/AICareerIntegration';
import Exploration from './pages/Exploration';
import Reflection from './pages/Reflection';
import Action from './pages/Action';
import { Toaster } from '@/components/ui/toaster';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/introspection" element={<ProtectedRoute><Introspection /></ProtectedRoute>} />
              <Route path="/ikigai" element={<ProtectedRoute><Ikigai /></ProtectedRoute>} />
              <Route path="/industry-research" element={<ProtectedRoute><IndustryResearch /></ProtectedRoute>} />
              <Route path="/ai-career-integration" element={<ProtectedRoute><AICareerIntegration /></ProtectedRoute>} />
              <Route path="/exploration" element={<ProtectedRoute><Exploration /></ProtectedRoute>} />
              <Route path="/reflection" element={<ProtectedRoute><Reflection /></ProtectedRoute>} />
              <Route path="/action" element={<ProtectedRoute><Action /></ProtectedRoute>} />
            </Routes>
            <Toaster />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
