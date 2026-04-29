import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Bus, MapPin, Clock, ArrowRight, TrendingUp, Zap, Star, Loader2 } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useActiveRide } from '../hooks/useActiveRide';
import { authService } from '../services/authService';
import { rideService } from '../services/rideService';
import SEO from '../components/SEO';

const Dashboard = () => {
  const navigate = useNavigate();
  const { activeRide, loading: rideLoading } = useActiveRide(10000);

  // Advanced Server State Management with TanStack Query
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: authService.getMe,
    initialData: () => {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : undefined;
    }
  });

  const { data: history = [], isLoading: historyLoading } = useQuery({
    queryKey: ['ride-history'],
    queryFn: rideService.getHistory,
    select: (data) => data.rides || []
  });

  const loading = userLoading || historyLoading || rideLoading;

  const stats = [
    { label: 'Total Rides', value: history.length, icon: Bus, trend: `Last: ${history[0]?.date || 'None'}`, color: 'text-primary' },
    { label: 'CO2 Saved', value: `${(history.length * 3.2).toFixed(1)}kg`, icon: TrendingUp, trend: 'Net Zero Target', color: 'text-blue-400' },
    { label: 'Elite Points', value: (history.length * 50).toLocaleString(), icon: Star, trend: 'Gold Tier', color: 'text-yellow-400' },
  ];

  const dashboardSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "ShuttleElite Command Center",
    "description": "Personalized tactical dashboard for ShuttleElite mobility members.",
    "breadcrumb": "Home > Dashboard"
  };

  if (loading && !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4" aria-live="polite">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-text-muted font-black animate-pulse uppercase tracking-widest text-xs">Synchronizing Tactical Feed...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 md:pb-10 animate-in fade-in duration-1000">
      <SEO 
        title="Command Center" 
        description="Monitor your tactical mobility operations and elite mission history in real-time."
        schema={dashboardSchema}
      />
      
      {/* Welcome Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Operations Hub</p>
          <h1 className="text-5xl md:text-6xl font-black text-text-main tracking-tighter uppercase italic leading-[0.9]">
            Welcome, <span className="text-primary">{user?.name?.split(' ')[0] || 'Agent'}</span>
          </h1>
          <p className="text-text-muted text-lg font-semibold tracking-tight">
            {activeRide ? "Active mission in progress. Live tracking enabled." : "System standby. Ready for your next deployment."}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          {activeRide ? (
            <Button 
              onClick={() => navigate('/tracking')} 
              aria-label="Track active mission live"
              className="md:h-16 h-14 px-10 text-lg font-black tracking-widest bg-blue-600 text-white shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:translate-y-[-2px] transition-all"
            >
              <MapPin className="w-5 h-5 mr-2" />
              TRACK LIVE
            </Button>
          ) : (
            <Button 
              onClick={() => navigate('/request')} 
              aria-label="Initiate new ride request"
              className="md:h-16 h-14 px-10 text-lg font-black tracking-widest shadow-[0_10px_30px_rgba(34,197,94,0.2)] hover:translate-y-[-2px] transition-all"
            >
              <Zap className="w-5 h-5 mr-2 fill-current" />
              BOOK NEW RIDE
            </Button>
          )}
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="region" aria-label="Operational Statistics">
        {stats.map((stat, idx) => (
          <Card key={idx} className="relative group overflow-hidden border-white/5! hover:border-primary/20! transition-all duration-500">
            <div className={`absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity`}>
              <stat.icon size={80} />
            </div>
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <p className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em]">{stat.label}</p>
                <p className="text-5xl font-black text-text-main tracking-tighter">{stat.value}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black px-2 py-1 rounded-md bg-white/5 uppercase tracking-wider ${stat.color}`}>
                    {stat.trend}
                  </span>
                </div>
              </div>
              <div className={`p-4 rounded-2xl bg-white/5 ${stat.color} shadow-inner`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card 
          title="Recent Activity" 
          subtitle="Your tactical operations log"
          className="lg:col-span-2 relative overflow-hidden bg-white/[0.02] border-white/5!"
        >
          <div className="space-y-4 mt-6">
             {history.slice(0, 3).map((ride, idx) => (
               <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Bus size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-text-main uppercase tracking-tight">{ride.pickup} → {ride.drop}</p>
                      <p className="text-xs text-text-muted font-semibold mt-0.5">{ride.date} • {ride.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black px-2 py-1 bg-white/5 rounded-md text-text-dim uppercase tracking-widest border border-white/5">Completed</span>
                  </div>
               </div>
             ))}
             {history.length === 0 && !loading && (
               <p className="text-center py-10 text-text-muted font-bold italic">No operations recorded in local history.</p>
             )}
          </div>
        </Card>

        <div className="space-y-6">
          <h3 className="text-xl font-black text-text-main tracking-tight px-1 uppercase italic">Tactical Links</h3>
          <Card 
            role="button"
            aria-label="Navigate to mission history"
            className="group cursor-pointer border-none bg-gradient-to-br from-primary/10 to-transparent hover:from-primary/20 transition-all border border-primary/10! rounded-3xl"
            onClick={() => navigate('/history')}
          >
            <div className="flex items-center justify-between p-2">
              <div className="space-y-1">
                <p className="text-lg font-black text-text-main uppercase tracking-tighter">Mission History</p>
                <p className="text-xs font-bold text-text-muted italic">Review {history.length} past operations</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:translate-x-2 transition-transform">
                <ArrowRight className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
