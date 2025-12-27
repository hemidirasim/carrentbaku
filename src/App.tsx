import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { LanguageProvider, useLanguage, type Language } from "@/contexts/LanguageContext";
import { AdminProvider } from "@/contexts/AdminContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdminRoute from "@/components/AdminRoute";
import Home from "./pages/Home";
import Cars from "./pages/Cars";
import CarDetail from "./pages/CarDetail";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import ServiceDetail from "./pages/ServiceDetail";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCars from "./pages/admin/Cars";
import AdminCarForm from "./pages/admin/CarForm";
import AdminReservations from "./pages/admin/Reservations";
import AdminBlog from "./pages/admin/Blog";
import AdminBlogForm from "./pages/admin/BlogForm";
import AdminServices from "./pages/admin/Services";
import AdminServiceForm from "./pages/admin/ServiceForm";
import AdminCategories from "./pages/admin/Categories";
import AdminCategoryForm from "./pages/admin/CategoryForm";
import AdminAbout from "./pages/admin/About";
import AdminContactInfo from "./pages/admin/ContactInfo";
import AdminAgentConfig from "./pages/admin/AgentConfig";
import AdminReviews from "./pages/admin/Reviews";
import AdminReviewForm from "./pages/admin/ReviewForm";
import ReservationRequest from "./pages/ReservationRequest";
import FloatingContactCTA from '@/components/FloatingContactCTA';
import ScrollToTop from "@/components/ScrollToTop";
import { stripLanguageFromPath } from "@/hooks/useLocalizedPath";

const queryClient = new QueryClient();

const SUPPORTED_LANGUAGES: Language[] = ['az', 'ru', 'en', 'ar'];

const isSupportedLanguage = (value?: string): value is Language =>
  Boolean(value && SUPPORTED_LANGUAGES.includes(value as Language));

// Google Tag initialization
const initializeGoogleTag = () => {
  if (typeof window !== 'undefined') {
    // Initialize dataLayer if it doesn't exist
    window.dataLayer = window.dataLayer || [];
    
    // Define gtag function if it doesn't exist
    if (typeof window.gtag === 'undefined') {
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
    }
    
    // Load Google Tag script if not already loaded
    if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=AW-10996198894';
      document.head.appendChild(script);
      
      script.onload = () => {
        window.gtag('js', new Date());
        window.gtag('config', 'AW-10996198894');
      };
    } else {
      // If script already exists, just configure
      window.gtag('js', new Date());
      window.gtag('config', 'AW-10996198894');
    }
  }
};

const LanguageRedirect = () => {
  const { language } = useLanguage();
  return <Navigate to={`/${language}`} replace />;
};

const LegacyRedirect = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const normalizedPath = stripLanguageFromPath(location.pathname);
  const targetPath = `/${language}${normalizedPath === '/' ? '' : normalizedPath}`;
  return (
    <Navigate
      to={`${targetPath}${location.search}${location.hash}`}
      replace
    />
  );
};

const PublicLayout = () => {
  const { lang } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    if (!isSupportedLanguage(lang)) {
      const fallback = isSupportedLanguage(language) ? language : 'az';
      const normalizedPath = stripLanguageFromPath(location.pathname);
      navigate(
        `/${fallback}${normalizedPath === '/' ? '' : normalizedPath}${location.search}${location.hash}`,
        { replace: true }
      );
      return;
    }
    if (lang !== language) {
      setLanguage(lang);
    }
  }, [lang, language, setLanguage, location.pathname, location.search, location.hash, navigate]);

  return (
    <div className="relative flex flex-col min-h-screen overflow-x-hidden w-full max-w-full">
      <Header />
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
      <FloatingContactCTA />
    </div>
  );
};

const App = () => {
  useEffect(() => {
    initializeGoogleTag();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AdminProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />
                <Route path="/admin/agent-config" element={
                  <AdminRoute>
                    <AdminAgentConfig />
                  </AdminRoute>
                } />
                <Route path="/admin/cars" element={
                  <AdminRoute>
                    <AdminCars />
                  </AdminRoute>
                } />
                <Route path="/admin/cars/new" element={
                  <AdminRoute>
                    <AdminCarForm />
                  </AdminRoute>
                } />
                <Route path="/admin/cars/:id/edit" element={
                  <AdminRoute>
                    <AdminCarForm />
                  </AdminRoute>
                } />
                <Route path="/admin/reservations" element={
                  <AdminRoute>
                    <AdminReservations />
                  </AdminRoute>
                } />
                <Route path="/admin/blog" element={
                  <AdminRoute>
                    <AdminBlog />
                  </AdminRoute>
                } />
                <Route path="/admin/blog/new" element={
                  <AdminRoute>
                    <AdminBlogForm />
                  </AdminRoute>
                } />
                <Route path="/admin/blog/:id/edit" element={
                  <AdminRoute>
                    <AdminBlogForm />
                  </AdminRoute>
                } />
                <Route path="/admin/services" element={
                  <AdminRoute>
                    <AdminServices />
                  </AdminRoute>
                } />
                <Route path="/admin/services/new" element={
                  <AdminRoute>
                    <AdminServiceForm />
                  </AdminRoute>
                } />
                <Route path="/admin/services/:id/edit" element={
                  <AdminRoute>
                    <AdminServiceForm />
                  </AdminRoute>
                } />
                <Route path="/admin/reviews" element={
                  <AdminRoute>
                    <AdminReviews />
                  </AdminRoute>
                } />
                <Route path="/admin/reviews/new" element={
                  <AdminRoute>
                    <AdminReviewForm />
                  </AdminRoute>
                } />
                <Route path="/admin/reviews/:id/edit" element={
                  <AdminRoute>
                    <AdminReviewForm />
                  </AdminRoute>
                } />
                <Route path="/admin/categories" element={
                  <AdminRoute>
                    <AdminCategories />
                  </AdminRoute>
                } />
                <Route path="/admin/categories/new" element={
                  <AdminRoute>
                    <AdminCategoryForm />
                  </AdminRoute>
                } />
                <Route path="/admin/categories/:id/edit" element={
                  <AdminRoute>
                    <AdminCategoryForm />
                  </AdminRoute>
                } />
                <Route path="/admin/about" element={
                  <AdminRoute>
                    <AdminAbout />
                  </AdminRoute>
                } />
                <Route path="/admin/contact-info" element={
                  <AdminRoute>
                    <AdminContactInfo />
                  </AdminRoute>
                } />
                
                {/* Public Routes */}
                <Route path="/" element={<LanguageRedirect />} />
                <Route path="/:lang/*" element={<PublicLayout />}>
                  <Route index element={<Home />} />
                  <Route path="cars" element={<Cars />} />
                  <Route path="cars/:id" element={<CarDetail />} />
                  <Route path="services" element={<Services />} />
                  <Route path="services/:id" element={<ServiceDetail />} />
                  <Route path="blog" element={<Blog />} />
                  <Route path="blog/:id" element={<BlogDetail />} />
                  <Route path="about" element={<About />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="terms" element={<Terms />} />
                  <Route path="reserve" element={<ReservationRequest />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
                <Route path="*" element={<LegacyRedirect />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AdminProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
