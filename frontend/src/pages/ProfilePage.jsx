import { useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { User, Mail, LogOut, ChevronLeft, Shield } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import SEO from "../components/SEO";
import { authService } from "../services/authService";

const ProfilePage = () => {
  const navigate = useNavigate();

  const { data: user } = useQuery({
    queryKey: ['user-profile'],
    queryFn: authService.getMe,
    initialData: () => {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : undefined;
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <SEO
        title="Agent Profile"
        description="Manage your ShuttleElite corporate agent profile and account settings."
      />

      <button 
        onClick={() => navigate(-1)}
        aria-label="Go back"
        className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-sm font-bold uppercase tracking-wider"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>

      <Card className="p-8 relative overflow-hidden group border-white/[0.03]">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-1000" />
        
        <div className="relative z-10 space-y-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.1)]">
              <User className="w-12 h-12 text-primary" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-text-main tracking-tighter uppercase italic">{user?.name || 'Agent'}</h1>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <Shield className="w-3 h-3 text-primary" aria-hidden="true" />
                <p className="text-primary font-black text-[10px] uppercase tracking-widest">Corporate Elite Member</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 border-y border-white/5 py-8" role="list" aria-label="Profile information">
            <div className="flex items-center gap-4 group/item" role="listitem">
              <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center shrink-0 group-hover/item:border-primary/30 transition-colors">
                <Mail className="w-5 h-5 text-text-dim group-hover/item:text-primary transition-colors" aria-hidden="true" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em]">Email Address</p>
                <p className="text-text-main font-bold tracking-tight">{user?.email || '—'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 group/item" role="listitem">
              <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center shrink-0 group-hover/item:border-primary/30 transition-colors">
                <User className="w-5 h-5 text-text-dim group-hover/item:text-primary transition-colors" aria-hidden="true" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em]">Agent Identity</p>
                <p className="text-text-main font-bold tracking-tight">{user?.name || '—'}</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleLogout}
            variant="danger"
            aria-label="Log out of ShuttleElite"
            className="w-full h-14 font-black uppercase tracking-widest group shadow-[0_10px_30px_rgba(239,68,68,0.1)]"
          >
            <LogOut className="mr-3 w-5 h-5 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            Terminate Session
          </Button>
        </div>
      </Card>

      <div className="text-center">
        <p className="text-[10px] text-text-dim font-black uppercase tracking-[0.2em] opacity-40">
          ShuttleElite Platform v1.0 • Enterprise Edition
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
