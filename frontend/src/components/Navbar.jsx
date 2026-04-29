import { NavLink, useNavigate } from 'react-router-dom';
import { Bus, History, Home, MapPin, LogOut, User as UserIcon } from 'lucide-react';
import { useActiveRide } from '../hooks/useActiveRide';
import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

const Navbar = () => {
  const navigate = useNavigate();
  const { activeRide } = useActiveRide(10000);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authService.getMe();
        setUser(userData);
      } catch (err) {
        console.error("Navbar user fetch error:", err);
      }
    };
    fetchUser();
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Request', path: '/request', icon: Bus },
    { name: 'Tracking', path: '/tracking', icon: MapPin, hasIndicator: !!activeRide },
    { name: 'History', path: '/history', icon: History },
    { name: 'Profile', path: '/profile', icon: UserIcon },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo Section */}
        <div 
          className="flex items-center gap-3 cursor-pointer group shrink-0" 
          onClick={() => navigate('/dashboard')}
        >
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)] group-hover:scale-105 transition-all duration-500">
            <Bus className="text-black w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tighter text-text-main group-hover:text-primary transition-all duration-300 font-heading italic uppercase">
            Shuttle<span className="text-primary">Elite</span>
          </span>
        </div>

        {/* Navigation Items */}
        <div className="hidden lg:flex items-center bg-white/5 rounded-2xl p-1.5 border border-white/5 mx-8">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 relative
                ${isActive 
                  ? 'bg-primary text-black shadow-[0_5px_15px_rgba(34,197,94,0.3)] scale-105 z-10' 
                  : 'text-text-muted hover:text-text-main hover:bg-white/5'}
              `}
            >
              <item.icon className={`w-4 h-4 ${window.location.pathname === item.path ? 'text-black' : ''}`} />
              <span>{item.name}</span>
              {item.hasIndicator && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary border-2 border-background"></span>
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Action Section */}
        <div className="flex items-center gap-6">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[11px] font-black uppercase tracking-[0.15em] hover:bg-red-500 hover:text-white transition-all duration-300 group"
          >
            <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
