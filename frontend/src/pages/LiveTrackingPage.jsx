import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, ShieldCheck, MapPin, Zap, Settings, Bus } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import MapWidget from '../components/MapWidget';
import DriverInfoCard from '../components/DriverInfoCard';
import { useActiveRide } from '../hooks/useActiveRide';
import { rideService } from '../services/rideService';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

const LiveTrackingPage = () => {
  const navigate = useNavigate();
  const { activeRide, loading, error } = useActiveRide(2000); // Poll every 2s
  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = async (newStatus) => {
    if (!activeRide) return;
    setUpdating(true);
    try {
      await rideService.updateStatus(activeRide._id, newStatus);
      toast.success(`Lifecycle updated to: ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update lifecycle");
    } finally {
      setUpdating(false);
    }
  };

  const getDistance = () => {
    if (!activeRide || !activeRide.driverLocation) return "0.0";
    const target = activeRide.status === 'arriving' ? activeRide.pickup : activeRide.drop;
    if (!target) return "0.0";
    
    // Haversine formula for distance in km
    const R = 6371;
    const dLat = (target.lat - activeRide.driverLocation.lat) * Math.PI / 180;
    const dLon = (target.lng - activeRide.driverLocation.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(activeRide.driverLocation.lat * Math.PI / 180) * Math.cos(target.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    return d.toFixed(1);
  };

  const getETA = () => {
    const dist = parseFloat(getDistance());
    // Assume 30km/h average city speed for simulation
    const minutes = Math.max(1, Math.ceil((dist / 30) * 60));
    return minutes;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-text-muted font-bold animate-pulse uppercase tracking-[0.2em]">Syncing tactical feed...</p>
      </div>
    );
  }

  // Implementation of conditional messaging for "Training" (Tracking) screen
  if (!activeRide) {
    return (
      <div className="max-w-4xl mx-auto p-6 min-h-[70vh] flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-700">
        <SEO 
          title="Live Tracking" 
          description="Real-time elite shuttle tracking. Book a ride to activate live telemetry."
        />
        <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/10 shadow-2xl">
          <MapPin size={48} className="text-primary/40" />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-text-main tracking-tighter uppercase italic leading-none">
            No Active <span className="text-primary">Mission</span>
          </h2>
          <p className="text-text-muted text-lg max-w-md mx-auto font-medium">
            Tactical tracking is unavailable. Please book a ride to activate live telemetry and satellite feed.
          </p>
        </div>
        <Button 
          onClick={() => navigate('/request')}
          aria-label="Book a new ride"
          className="h-16 px-10 text-lg font-black tracking-widest bg-primary text-black shadow-[0_0_40px_rgba(34,197,94,0.3)] hover:scale-105 transition-all"
        >
          BOOK A RIDE NOW
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 pb-32 md:pb-8 space-y-6 animate-in fade-in duration-700">
      <SEO 
        title="Live Tracking" 
        description="Your ShuttleElite driver is on the way. Track your mission in real-time."
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "ShuttleElite Live Tracking",
          "description": "Real-time GPS tracking for your ShuttleElite corporate mobility mission."
        }}
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-3 bg-card border border-border hover:bg-card-hover rounded-2xl transition-all group"
          >
            <ChevronLeft className="w-5 h-5 text-text-muted group-hover:text-primary" />
          </button>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-text-main tracking-tighter uppercase italic leading-none">
              Live <span className="text-primary">Tracking</span>
            </h1>
            <p className="text-[10px] md:text-xs text-text-muted font-black uppercase tracking-[0.3em] mt-2">
              ID: {activeRide._id.slice(-8).toUpperCase()} • {activeRide.status.replace('_', ' ')}
            </p>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="flex items-center gap-3 px-6 py-2.5 bg-primary/10 border border-primary/20 rounded-full">
          <span className="w-2 h-2 bg-primary rounded-full animate-ping" />
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Secure Feed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map Container */}
        <div className="lg:col-span-8 h-[500px] md:h-[650px] relative">
          <MapWidget ride={activeRide} />
          
          {/* Floating ETA Overlay */}
          <div className="absolute bottom-6 left-6 right-6 md:right-auto z-10">
            <div className="bg-slate-900/90 backdrop-blur-xl p-4 rounded-[2rem] border border-white/10 shadow-2xl flex items-center gap-5 animate-in slide-in-from-bottom-4 text-white">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex flex-col items-center justify-center text-primary border border-primary/20">
                <span className="text-xl font-black leading-none">{getETA()}</span>
                <span className="text-[8px] font-black uppercase tracking-tighter mt-1">Min</span>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.25em] leading-none mb-1.5">Shuttle Arrival</p>
                <p className="text-sm font-black text-white tracking-tight uppercase italic">
                  {activeRide.status === 'arriving' ? 'Arriving at Node' : 
                   activeRide.status === 'ongoing' ? 'En Route to Destination' : 
                   'Synchronizing...'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Column */}
        <div className="lg:col-span-4 flex flex-col h-full bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] leading-none mb-1">System Live</p>
                  <p className="text-xs text-text-muted font-bold uppercase tracking-widest">
                    {activeRide.status.replace('_', ' ')}
                  </p>
                </div>
                <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
                  <Bus className="text-primary w-5 h-5" />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <div className="w-[1px] h-10 bg-slate-100" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Pickup</p>
                    <p className="text-xs font-bold text-slate-800 truncate">{activeRide.pickupName}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Destination</p>
                    <p className="text-xs font-bold text-slate-800 truncate">{activeRide.dropName}</p>
                  </div>
                </div>
              </div>
            </div>

            <DriverInfoCard ride={activeRide} />
          </div>
          
          <div className="p-4 border-t border-slate-50">
            <Button 
              variant="outline" 
              className="w-full h-12 rounded-xl border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all"
              onClick={() => {
                if(confirm('Cancel this shuttle booking?')) {
                  handleStatusUpdate('completed');
                }
              }}
            >
              Cancel Shuttle Booking
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Demo Control Panel */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-[#0F172A]/90 backdrop-blur-2xl px-6 py-4 rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-6">
          <div className="flex flex-col border-r border-white/10 pr-6 mr-2">
            <span className="text-[8px] font-black text-primary uppercase tracking-[0.3em]">Demo Controller</span>
            <span className="text-[10px] font-bold text-white/50">Manual Lifecycle</span>
          </div>
          
          <div className="flex items-center gap-2">
            {[
              { id: 'assigned', label: 'Assign' },
              { id: 'arriving', label: 'Arrive' },
              { id: 'ongoing', label: 'Start' },
              { id: 'completed', label: 'Done' }
            ].map(s => (
              <button
                key={s.id}
                onClick={() => handleStatusUpdate(s.id)}
                disabled={updating || activeRide.status === s.id}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeRide.status === s.id 
                    ? 'bg-primary text-black' 
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                } disabled:opacity-50`}
              >
                {s.label}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2 pl-4 border-l border-white/10">
             <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-text-muted uppercase">Ping</span>
                <span className="text-[10px] font-bold text-primary">2.0s</span>
             </div>
             <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap size={14} className="text-primary animate-pulse" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTrackingPage;
