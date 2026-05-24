import { Link, useLocation, useNavigate } from "react-router-dom";
import { Plane, Menu, X, ShoppingBag, User, Flame, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../utils/cn";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Menu", path: "/menu" },
  { name: "Specials", path: "/specials" },
  { name: "About", path: "/about" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems, openCart } = useCart();
  const { user, openAuthModal, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 pointer-events-auto",
        isScrolled ? "bg-white/5 backdrop-blur-xl border-b border-white/10 py-3 shadow-xl" : "py-5 border-b border-white/10 backdrop-blur-md bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to={user?.isAdmin ? "/admin" : "/"} className="flex items-center gap-2 group">
          <Plane className="w-8 h-8 text-gold-500 group-hover:rotate-12 transition-transform duration-300" />
          <span className="heading-serif font-bold text-xl tracking-widest text-white uppercase">
            KVR'S Flight
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {!user?.isAdmin && navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const isSpecial = link.name === "Specials";
            return (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "text-sm font-bold tracking-wide uppercase transition-colors relative flex items-center gap-1.5",
                  isActive ? "text-gold-500" : (isSpecial ? "text-orange-500 hover:text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" : "text-gray-300 hover:text-gold-400")
                )}
              >
                {isSpecial && <Flame className="w-4 h-4 animate-pulse" />}
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-2 inset-x-0 h-0.5 bg-gold-500"
                  />
                )}
              </Link>
            );
          })}
          {user?.isAdmin && (
            <span className="text-sm font-bold tracking-widest uppercase text-purple-400 border border-purple-500/30 bg-purple-500/10 px-3 py-1 rounded">
              ADMIN CONTROL PANEL
            </span>
          )}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          {user?.isAdmin && (
            <Link 
              to="/admin"
              className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-wide flex items-center gap-2 border border-purple-500/20 bg-purple-500/5 px-3 py-1.5 rounded-lg"
            >
              <span>Dashboard</span>
            </Link>
          )}

          <button 
            onClick={() => {
              if (user) {
                navigate('/profile');
              } else {
                openAuthModal();
              }
            }}
            className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-gold-400 transition-colors uppercase tracking-wide cursor-pointer"
          >
            <User className="w-5 h-5" />
            <span className="sr-only lg:not-sr-only">
              {user ? 'Profile' : 'SignIn'}
            </span>
          </button>

          {user && (
            <button 
              onClick={() => {
                logout();
                toast.success('Logged out successfully');
                navigate('/');
              }}
              className="text-gray-300 hover:text-red-400 transition-colors cursor-pointer ml-1"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}

          {!user?.isAdmin && (
            <>
              <button 
                onClick={openCart}
                className="relative p-2 text-gray-300 hover:text-gold-400 transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-gold-500 text-dark-950 text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              <Link
                to="/contact"
                className="ml-2 px-5 py-2 border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-dark-950 transition-all font-medium uppercase text-sm tracking-wider"
              >
                Book Flight
              </Link>
            </>
          )}
        </div>

        {/* Mobile Nav Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <button 
            onClick={() => {
              if (user) {
                navigate('/profile');
              } else {
                openAuthModal();
              }
            }}
            className="text-gray-300 hover:text-gold-400 transition-colors cursor-pointer"
          >
            <User className="w-5 h-5" />
          </button>

          {user && (
            <button 
              onClick={() => {
                logout();
                toast.success('Logged out successfully');
                navigate('/');
              }}
              className="text-gray-300 hover:text-red-400 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}

          {!user?.isAdmin && (
            <button 
              onClick={openCart}
              className="relative p-1 text-gray-300 hover:text-gold-400 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold-500 text-dark-950 text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          )}

          <button
            className="text-white cursor-pointer hover:text-gold-500 transition-colors ml-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full inset-x-0 bg-[#060b19] border-b border-white/10 p-6 flex flex-col gap-4 md:hidden shadow-2xl z-[60]"
          >
            {!user?.isAdmin && navLinks.map((link) => {
              const isSpecial = link.name === "Specials";
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "text-lg font-bold tracking-wide uppercase transition-colors cursor-pointer flex items-center gap-2 py-2",
                    location.pathname === link.path ? "text-gold-500" : (isSpecial ? "text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" : "text-gray-300 hover:text-gold-400")
                  )}
                >
                  {isSpecial && <Flame className="w-5 h-5 animate-pulse" />}
                  {link.name}
                </Link>
              );
            })}
            
            {user?.isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-bold tracking-wide uppercase transition-colors cursor-pointer text-purple-400 py-2 border-t border-white/10 mt-2 flex items-center justify-between"
              >
                <span>Admin Dashboard</span>
                <span className="text-xs bg-purple-500/20 px-2 py-1 rounded">Control</span>
              </Link>
            )}

            {!user?.isAdmin && (
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-4 text-center px-6 py-3 border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-dark-950 transition-all font-medium uppercase tracking-wider cursor-pointer"
              >
                Book Flight
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
