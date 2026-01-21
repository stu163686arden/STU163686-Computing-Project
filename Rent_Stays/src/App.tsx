import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";

// Customer Pages
import Index from "./pages/customer/Index";
import UnitPage from "./pages/customer/UnitPage";
import Search from "./pages/customer/Search";
import TenantDashboard from "./pages/Dashboard";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProperties from "./pages/admin/Properties";
import AdminPropertyDetails from "./pages/admin/PropertyDetails";
import AdminNewProperty from "./pages/admin/NewProperty";
import AdminBookings from "./pages/admin/Bookings";
import AdminTenants from "./pages/admin/Tenants";
import AdminReports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/Settings";
import AdminNotifications from "./pages/admin/Notifications";
import AdminEditProperty from "./pages/admin/EditProperty";

// Admin Layout
import { MainLayout } from "./components/admin/layout/MainLayout";

// Shared
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/property/:slug" element={<UnitPage />} />
            <Route path="/search" element={<Search />} />
            <Route path="/dashboard" element={<ProtectedRoute><TenantDashboard /></ProtectedRoute>} />

            {/* Admin Routes */}
            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute><MainLayout><AdminDashboard /></MainLayout></ProtectedRoute>} />
            <Route path="/admin/properties" element={<ProtectedRoute><MainLayout><AdminProperties /></MainLayout></ProtectedRoute>} />
            <Route path="/admin/properties/:id" element={<ProtectedRoute><MainLayout><AdminPropertyDetails /></MainLayout></ProtectedRoute>} />
            <Route path="/admin/properties/new" element={<ProtectedRoute><MainLayout><AdminNewProperty /></MainLayout></ProtectedRoute>} />
            <Route path="/admin/bookings" element={<ProtectedRoute><MainLayout><AdminBookings /></MainLayout></ProtectedRoute>} />
            <Route path="/admin/tenants" element={<ProtectedRoute><MainLayout><AdminTenants /></MainLayout></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute><MainLayout><AdminReports /></MainLayout></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute><MainLayout><AdminSettings /></MainLayout></ProtectedRoute>} />
            <Route path="/admin/notifications" element={<ProtectedRoute><MainLayout><AdminNotifications /></MainLayout></ProtectedRoute>} />
            <Route path="/admin/properties/:id/edit" element={<ProtectedRoute><MainLayout><AdminEditProperty /></MainLayout></ProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
