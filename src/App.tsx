import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Videos from "./pages/Videos";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminVideos from "./pages/admin/Videos";
import AdminGallery from "./pages/admin/Gallery";
import AdminHero from "./pages/admin/Hero";
import AdminPosts from "./pages/admin/Posts";
import AdminUsers from "./pages/admin/Users";
import AdminSettings from "./pages/admin/Settings";
import AdminIntegrations from "./pages/admin/Integrations";
import AdminContact from "./pages/admin/Contact";
import AdminAuth from "./pages/admin/Auth";
import DancingMascot from "@/components/DancingMascot";
import { SiteContentProvider } from "./context/SiteContentContext";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <SiteContentProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin/login" element={<AdminAuth />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="videos" element={<AdminVideos />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="hero" element={<AdminHero />} />
                <Route path="posts" element={<AdminPosts />} />
                <Route path="contact" element={<AdminContact />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="integrations" element={<AdminIntegrations />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <DancingMascot />
          </BrowserRouter>
        </SiteContentProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
