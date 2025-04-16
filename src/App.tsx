
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import Farm from "./pages/Farm";
import { useEffect } from "react";
import supabase from "@/lib/supabase";

const queryClient = new QueryClient();

const App = () => {
  // Add debug logging
  useEffect(() => {
    // Checking supabase connection on app load
    const checkSupabase = async () => {
      try {
        console.log("Testing Supabase connection...");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Supabase connection error:", error);
        } else {
          console.log("Supabase connection successful:", data.session ? "User session found" : "No user session");
        }
        
        // Test database connection by attempting to query the fitness_activities table
        console.log("Testing database connection...");
        const { data: fitnessData, error: fitnessError } = await supabase
          .from('fitness_activities')
          .select('*')
          .limit(1);
          
        if (fitnessError) {
          console.error("Database query error:", fitnessError);
        } else {
          console.log("Database connection successful:", fitnessData);
        }
        
      } catch (err) {
        console.error("Supabase check failed:", err);
      }
    };
    
    checkSupabase();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/farm" element={<Farm />} />
              </Route>
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
