
import { useEffect } from "react";
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
import Instructions from "./pages/Instructions";
import supabase from "@/lib/supabase";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        console.log("🔍 Checking Supabase Connection...");
        
        // Check authentication session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("❌ Supabase Session Error:", sessionError);
        } else {
          console.log("✅ Supabase Session Status:", sessionData.session ? "Active" : "No Active Session");
        }
        
        // Test database connectivity
        const { data, error } = await supabase
          .from('fitness_activities')
          .select('*')
          .limit(1);
        
        if (error) {
          console.error("❌ Database Query Error:", error);
        } else {
          console.log("✅ Database Query Successful:", data);
        }
        
      } catch (err) {
        console.error("❌ Supabase Connection Failed:", err);
      }
    };
    
    checkSupabaseConnection();
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
              <Route path="/instructions" element={<Instructions />} />
              
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
