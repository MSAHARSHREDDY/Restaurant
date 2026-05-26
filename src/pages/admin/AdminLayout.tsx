import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  ChefHat, 
  CalendarCheck, 
  BarChart3, 
  Tag, 
  TrendingUp, 
  Sliders,
  Bell,
  CheckCheck,
  Volume2,
  VolumeX,
  X
} from 'lucide-react';

function formatTimeAgo(dateString: string) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return new Date(dateString).toLocaleDateString();
}

/**
 * Synthesizes a high-fidelity electronic airfield cabin tone on-demand
 * using the browser's built-in Web Audio API context.
 */
function playCabinChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    const playTone = (frequency: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, startTime);
      
      gainNode.gain.setValueAtTime(0.18, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    // Elegant major third sequence: High chime (C#5 followed by A5)
    playTone(554.37, now, 0.45); // C#5
    playTone(880.00, now + 0.12, 0.65); // A5
  } catch (err) {
    console.warn("Chime generation blocked or not supported:", err);
  }
}

export function AdminLayout() {
  const { user, token } = useAuth();
  const location = useLocation();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [soundMuted, setSoundMuted] = useState(() => localStorage.getItem("admin_notif_muted") === "true");

  const seenIdsRef = useRef<Set<string>>(new Set());

  // Polling notifications engine
  const fetchAndSyncNotifications = async (isFirstLoad = false) => {
    if (!token) return;
    try {
      const res = await fetch("/api/admin/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        
        // If it isn't the first load, trigger announcements for any items not currently in seen IDs
        if (!isFirstLoad && data.length > 0) {
          const freshItems = data.filter((n: any) => !seenIdsRef.current.has(n._id));
          if (freshItems.length > 0) {
            freshItems.forEach((newNotif: any) => {
              // Trigger UI Toast alert
              toast.success(
                <div className="flex flex-col gap-1 font-sans text-xs">
                  <span className="font-bold text-white text-[11px] uppercase tracking-wide flex items-center gap-1.5">
                    <span className="text-gold-500 font-mono animate-bounce">✈️</span> {newNotif.title}
                  </span>
                  <span className="text-gray-300">{newNotif.message}</span>
                </div>,
                {
                  duration: 8000,
                  position: "top-right",
                  style: {
                    background: "#18181b",
                    color: "#fff",
                    border: "1px solid rgba(245, 158, 11, 0.2)"
                  }
                }
              );
            });

            // Trigger synthesized dual-announcement sound
            if (!soundMuted) {
              playCabinChime();
            }
          }
        }

        // Cache all retrieved notification IDs in seen Set
        data.forEach((n: any) => seenIdsRef.current.add(n._id));

        setNotifications(data);
        setUnreadCount(data.filter((n: any) => !n.isRead).length);
      }
    } catch (err) {
      console.error("Polled notifications sync failed:", err);
    }
  };

  useEffect(() => {
    if (!token) return;

    // Load initial history baseline immediately
    fetchAndSyncNotifications(true);

    // Client-side polling interval (runs every 6 seconds)
    const activePoll = setInterval(() => {
      fetchAndSyncNotifications(false);
    }, 6000);

    return () => {
      clearInterval(activePoll);
    };
  }, [token, soundMuted]);

  const markAllAsRead = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/admin/notifications/mark-read", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
        toast.success("All notifications flagged as checked");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // On mobile, scroll to the content area automatically when navigating, 
    // with an offset to avoid being hidden behind the fixed main header.
    if (window.innerWidth < 768 && contentRef.current) {
      const yOffset = -96; // Adjust for the main top navigation padding (approx pt-24)
      const element = contentRef.current;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [location.pathname]);

  if (!user?.isAdmin) {
    return (
      <div className="w-full pt-32 pb-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-400">You need admin privileges to view this page.</p>
          <Link to="/" className="text-gold-500 hover:text-gold-400 mt-4 inline-block">Return Home</Link>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5 mr-3" /> },
    { name: 'Meal Menu', path: '/admin/menu', icon: <ChefHat className="w-5 h-5 mr-3" /> },
    { name: 'Reservations', path: '/admin/reservations', icon: <CalendarCheck className="w-5 h-5 mr-3" /> },
    { name: 'Sales Tracker', path: '/admin/sales', icon: <TrendingUp className="w-5 h-5 mr-3" /> },
    { name: 'Campaign Offers', path: '/admin/offers', icon: <Tag className="w-5 h-5 mr-3" /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <BarChart3 className="w-5 h-5 mr-3" /> },
    { name: 'Users', path: '/admin/users', icon: <Users className="w-5 h-5 mr-3" /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart className="w-5 h-5 mr-3" /> },
    { name: 'Settings', path: '/admin/settings', icon: <Sliders className="w-5 h-5 mr-3" /> },
  ];

  return (
    <div className="w-full min-h-screen pt-24 bg-dark-950 flex flex-col md:flex-row relative">
      <div className="w-full md:w-64 bg-dark-900 border-r border-white/10 p-6 flex-shrink-0 min-h-full relative">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-white uppercase tracking-widest text-gold-500">Admin Portal</h2>
          
          <div className="flex items-center gap-1.5 relative">
            {/* Chime State */}
            <button 
              onClick={() => {
                const updated = !soundMuted;
                setSoundMuted(updated);
                localStorage.setItem("admin_notif_muted", String(updated));
                toast.success(updated ? "Cockpit chime muted" : "Cockpit chime activated");
              }}
              className="text-gray-500 hover:text-white transition-colors p-1 rounded hover:bg-white/5 cursor-pointer"
              title={soundMuted ? "Unmute cockpit announcements" : "Mute cockpit announcements"}
            >
              {soundMuted ? <VolumeX className="w-4.5 h-4.5 text-rose-500/80" /> : <Volume2 className="w-4.5 h-4.5 text-emerald-500/80" />}
            </button>

            {/* Notification Bell */}
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-1.5 rounded-lg transition-all border cursor-pointer ${
                showNotifications 
                  ? 'bg-gold-500/10 border-gold-500 text-gold-500' 
                  : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:border-white/10'
              }`}
              title="Ticket Alerts Center"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white font-mono animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Floating Flight Log Alerts Dropdown Panel */}
        {showNotifications && (
          <div className="absolute top-18 left-6 md:left-64 bg-dark-900 border border-white/10 rounded-2xl w-[310px] sm:w-[350px] shadow-2xl overflow-hidden z-[9999] animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="px-4 py-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-gold-500" />
                <span className="text-[10px] uppercase font-bold text-white tracking-widest font-mono">Cabin Log Alerts</span>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-[9px] uppercase font-bold tracking-wider text-gold-500 hover:text-white font-mono flex items-center gap-1 cursor-pointer"
                    title="Clear all alerts"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Clear Flags
                  </button>
                )}
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-500 hover:text-white p-0.5 rounded transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            
            <div className="max-h-[350px] overflow-y-auto divide-y divide-white/5 font-sans">
              {notifications.length === 0 ? (
                <div className="py-12 text-center text-gray-500 text-xs font-mono px-4">
                  No airline alerts listed on this flight.
                </div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif._id} 
                    className={`p-3.5 transition-colors flex items-start gap-3 relative hover:bg-white/3 ${
                      !notif.isRead ? 'bg-gold-500/[0.02]' : ''
                    }`}
                  >
                    {!notif.isRead && (
                      <span className="absolute left-2.5 top-5 w-1.5 h-1.5 bg-gold-400 rounded-full animate-ping" />
                    )}
                    <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 shrink-0 flex items-center justify-center text-gold-500">
                      <ShoppingCart className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <p className={`text-[12px] leading-tight text-white mb-0.5 ${!notif.isRead ? 'font-bold' : 'font-medium'}`}>{notif.title}</p>
                        <span className="text-[9px] text-gray-500 font-mono shrink-0">{formatTimeAgo(notif.createdAt)}</span>
                      </div>
                      <p className="text-xs text-gray-400 leading-normal line-clamp-3">{notif.message}</p>
                      {!notif.isRead && (
                        <button 
                          onClick={() => markAsRead(notif._id)}
                          className="mt-1.5 text-[9px] uppercase font-bold tracking-wider text-gold-500/85 hover:text-gold-400 cursor-pointer font-mono"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <nav className="space-y-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-gold-500 text-dark-950 font-medium font-bold' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div ref={contentRef} className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
