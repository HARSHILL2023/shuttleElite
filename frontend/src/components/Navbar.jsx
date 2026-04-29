
import { NavLink, useNavigate } from 'react-router-dom';
import { Bus, History, Home, MapPin, LogOut, User } from 'lucide-react';
import Button from './Button';

const Navbar = () => {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Request', path: '/request', icon: Bus },
    { name: 'Tracking', path: '/tracking', icon: MapPin },
    { name: 'History', path: '/history', icon: History },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg md:max-w-7xl md:top-0 md:bottom-auto md:translate-x-0 md:left-0 md:right-0 md:w-full z-50">
      <div className="mx-auto px-4 md:px-8 py-3 md:py-4 bg-card/60 backdrop-blur-2xl border border-white/5 rounded-2xl md:rounded-none md:border-b md:bg-background/80">
        <div className="flex items-center justify-between">
          <div 
            className="hidden md:flex items-center gap-3 cursor-pointer group" 
            onClick={() => navigate('/dashboard')}
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.4)] group-hover:scale-110 transition-transform">
              <Bus className="text-black w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-text-main group-hover:text-primary transition-colors">
              Shuttle<span className="text-primary">Elite</span>
            </span>
          </div>

          <div className="flex items-center justify-around md:justify-end w-full md:w-auto md:gap-10">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex flex-col md:flex-row items-center gap-1.5 md:gap-2.5 text-[10px] md:text-sm font-bold transition-all duration-300
                  ${isActive ? 'text-primary' : 'text-text-muted hover:text-text-main'}
                `}
              >
                <div className={`p-2 rounded-xl transition-all duration-300 ${window.location.pathname === item.path ? 'bg-primary/10' : 'group-hover:bg-white/5'}`}>
                  <item.icon className="w-5 h-5 md:w-4 md:h-4" />
                </div>
                <span className="md:block">{item.name}</span>
              </NavLink>
            ))}
            
            <div className="hidden md:block h-8 w-[1px] bg-white/5 mx-2"></div>
            
            <Button 
              variant="ghost" 
              className="hidden md:flex items-center gap-2 group"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 group-hover:text-red-500 transition-colors" />
              <span className="group-hover:text-red-500 transition-colors">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>

  );
};

export default Navbar;
