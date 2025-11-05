import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";
import Layout from "./layouts/Layout";
import Action from "./pages/Action";
import { RequireAuth, RedirectIfAuth } from "../src/components/RouteGuards";
import LatestResult from "./pages/LatestResult";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes (always accessible) */}
          <Route path="/" element={<Index />} />

          {/* Public-only (blocked when logged in) */}
          <Route element={<RedirectIfAuth />}>
            <Route path="/auth" element={<Auth />} />
          </Route>

          {/* Private routes (need token) */}
          <Route element={<RequireAuth />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/latest-results" element={<LatestResult />} />
              <Route path="/results" element={<Results />} />
              <Route path="/action" element={<Action />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
