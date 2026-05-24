import { Outlet, useLocation, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { useEffect } from "react";
import { AuthModal } from "./components/AuthModal";
import { CartDrawer } from "./components/CartDrawer";
import { useAuth } from "./context/AuthContext";

export function MainLayout() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // If logged-in user is an admin and tries to access customer pages, redirect to admin panel
  if (user?.isAdmin && !pathname.startsWith('/admin') && pathname !== '/profile') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-dark-950 font-sans text-white selection:bg-gold-500 selection:text-black">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[100px]"></div>
        {/* Mock Cockpit View Grid */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="relative z-10 flex flex-col flex-grow w-full md:overflow-y-auto">
        <Navbar />
        <main className="flex-grow flex flex-col">
          <Outlet />
        </main>
        {!user?.isAdmin && <Footer />}
      </div>

      <AuthModal />
      {!user?.isAdmin && <CartDrawer />}

      {/* Decorative Grid Overlay */}
      <div className="pointer-events-none absolute inset-0 border-[12px] md:border-[24px] border-white/5 z-[100]"></div>
    </div>
  );
}
