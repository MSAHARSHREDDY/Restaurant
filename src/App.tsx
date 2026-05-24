/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { MainLayout } from "./Layout";
import { Home } from "./pages/Home";
import { Menu } from "./pages/Menu";
import { About } from "./pages/About";
import { Gallery } from "./pages/Gallery";
import { Contact } from "./pages/Contact";
import { Specials } from "./pages/Specials";
import { Checkout } from "./pages/Checkout";
import { ResetPassword } from "./pages/ResetPassword";
import { Profile } from "./pages/Profile";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminOrders } from "./pages/admin/AdminOrders";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminMenu } from "./pages/admin/AdminMenu";
import { AdminReservations } from "./pages/admin/AdminReservations";
import { AdminAnalytics } from "./pages/admin/AdminAnalytics";
import { AdminOffers } from "./pages/admin/AdminOffers";
import { AdminSales } from "./pages/admin/AdminSales";
import { AdminSettings } from "./pages/admin/AdminSettings";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Toaster position="top-center" toastOptions={{
              className: '!bg-dark-900 !text-white !border !border-white/10 !shadow-xl',
              success: { iconTheme: { primary: '#D4AF37', secondary: '#090E17' } }
            }} />
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="menu" element={<Menu />} />
                <Route path="about" element={<About />} />
                <Route path="specials" element={<Specials />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="contact" element={<Contact />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="reset-password" element={<ResetPassword />} />
                <Route path="profile" element={<Profile />} />
                
                <Route path="admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="menu" element={<AdminMenu />} />
                  <Route path="reservations" element={<AdminReservations />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="offers" element={<AdminOffers />} />
                  <Route path="sales" element={<AdminSales />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

