import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Connections from "./pages/Connections";
import Institutions from "./pages/Institutions";
import Profiles from "./pages/Profiles";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import UserDetail from "./pages/UserDetail"; // Import the new UserDetail component

const queryClient = new QueryClient();

// Create a protected route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            } />
            <Route path="/connections" element={
              <ProtectedRoute>
                <Connections />
              </ProtectedRoute>
            } />
            <Route path="/institutions" element={
              <ProtectedRoute>
                <Institutions />
              </ProtectedRoute>
            } />
            <Route path="/profiles" element={
              <ProtectedRoute>
                <Profiles />
              </ProtectedRoute>
            } />
            {/* New route for user detail */}
            <Route path="/user/:id" element={
              <ProtectedRoute>
                <UserDetail />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;