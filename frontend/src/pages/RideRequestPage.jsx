import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Clock, Calendar, ChevronLeft, Info, Sparkles, Navigation, Bus, Timer } from 'lucide-react';
import Card from '../components/Card';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import SEO from '../components/SEO';
import toast from 'react-hot-toast';
import { rideService } from '../services/rideService';

const LOCATIONS = {
  Home: { lat: 23.0225, lng: 72.5714 },
  Office: { lat: 23.0300, lng: 72.5800 }
};

const OPTIONS = ["Home", "Office"];

const RideRequestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    pickup: 'Home',
    drop: 'Office',
    time: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shuttleInfo, setShuttleInfo] = useState('');
  const [countdown, setCountdown] = useState(null);

  // Shuttle Schedule Logic
  useEffect(() => {
    const calculateShuttle = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      if (formData.pickup === "Home") {
        // Morning Shuttle Logic (Home -> Office)
        // Shuttles at 08:00, 08:30, 09:00, 09:30, 10:00
        const slots = [8, 8.5, 9, 9.5, 10];
        const currentTimeInSlots = currentHour + currentMinute / 60;
        
        const nextSlot = slots.find(slot => slot > currentTimeInSlots);
        
        if (nextSlot) {
          const nextHour = Math.floor(nextSlot);
          const nextMin = (nextSlot % 1) * 60;
          const timeStr = `${nextHour.toString().padStart(2, '0')}:${nextMin.toString().padStart(2, '0')}`;
          
          const waitMinutes = Math.round((nextSlot - currentTimeInSlots) * 60);
          setShuttleInfo(`Next morning shuttle arrives in ${waitMinutes} minutes`);
          setCountdown(waitMinutes);
          setFormData(prev => ({ ...prev, time: timeStr, drop: "Office" }));
        } else {
          setShuttleInfo("Morning shuttles concluded. Evening service departs at 19:30.");
          setFormData(prev => ({ ...prev, time: "19:30", pickup: "Office", drop: "Home" }));
        }
      } else {
        // Evening Shuttle Logic (Office -> Home)
        setShuttleInfo("Evening elite shuttle departs at 19:30 PM sharp.");
        setFormData(prev => ({ ...prev, time: "19:30", drop: "Home" }));
        setCountdown(null);
      }
    };

    calculateShuttle();
    const interval = setInterval(calculateShuttle, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, [formData.pickup]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.pickup === formData.drop) {
      toast.error("Strategic failure: Pickup and Destination cannot be identical.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const pickupCoords = LOCATIONS[formData.pickup];
      const dropCoords = LOCATIONS[formData.drop];

      const data = await rideService.requestRide({
        pickup: pickupCoords,
        drop: dropCoords,
        pickupName: formData.pickup,
        dropName: formData.drop,
        date: formData.date,
        time: formData.time
      });

      if (data.ride) {
        toast.success("Elite shuttle booking confirmed");
        navigate('/tracking');
      } else {
        setError(data.message || "Booking failed");
      }
    } catch (err) {
      setError(err.message || "System offline.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-700">
      <SEO title="Elite Shuttle Booking" />

      {/* Header */}
      <div className="flex items-center gap-6">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-card border border-border hover:bg-card-hover rounded-2xl transition-all group"
        >
          <ChevronLeft className="w-6 h-6 text-text-muted group-hover:text-primary" />
        </button>
        <div className="flex items-center gap-4">
          <img src="/shuttle_logo.png" alt="Logo" className="w-12 h-12 rounded-xl shadow-lg shadow-primary/10 border border-primary/20" />
          <div>
            <h1 className="text-3xl font-black text-text-main tracking-tight uppercase italic leading-none">
              Elite <span className="text-primary">Shuttle</span>
            </h1>
            <p className="text-text-muted font-bold text-xs uppercase tracking-widest mt-1">Scheduled Tactical Mobility</p>
          </div>
        </div>
      </div>

      <Card className="relative overflow-hidden group border-white/5!">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] -rotate-12">
          <Bus size={120} />
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
          {/* Schedule Banner */}
          <div className="bg-primary/10 border border-primary/20 p-6 rounded-3xl flex items-center gap-6 animate-pulse">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
              <Timer className="text-primary w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Live Schedule</p>
              <h3 className="text-lg font-black text-white tracking-tight uppercase italic">{shuttleInfo}</h3>
            </div>
          </div>

          {/* Location Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
               <Select
                  label="Pickup Node"
                  options={OPTIONS}
                  value={formData.pickup}
                  onChange={(e) => setFormData({...formData, pickup: e.target.value})}
                  required
                  className="h-16 bg-white/5 border-white/5! text-lg font-bold"
                />
            </div>
            <div className="space-y-6">
               <Select
                  label="Drop Node"
                  options={OPTIONS}
                  value={formData.drop}
                  onChange={(e) => setFormData({...formData, drop: e.target.value})}
                  required
                  className="h-16 bg-white/5 border-white/5! text-lg font-bold"
                />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/5">
            <div className="flex items-start gap-6 opacity-50">
              <div className="mt-1 w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6 text-text-muted" />
              </div>
              <div className="flex-1">
                <Input
                  label="Operation Date"
                  type="date"
                  value={formData.date}
                  readOnly
                  className="h-14 bg-white/5 border-white/5!"
                />
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="mt-1 w-12 h-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <Input
                  label="Departure Time"
                  type="text"
                  value={formData.time}
                  readOnly
                  className="h-14 bg-white/5 border-white/5! text-primary font-black text-xl"
                />
              </div>
            </div>
          </div>

          {/* Seat Availability Simulation */}
          <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
             <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                   {[1,2,3,4].map(i => (
                     <img key={i} className="w-8 h-8 rounded-full border-2 border-slate-900" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                   ))}
                </div>
                <p className="text-xs font-bold text-text-muted uppercase">12 Seats Remaining</p>
             </div>
             <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-black text-green-500 uppercase tracking-widest">
                High Availability
             </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex flex-col gap-3">
              <p className="text-red-500 text-sm font-bold uppercase tracking-tight">{error}</p>
              <Button variant="outline" onClick={() => navigate('/tracking')}>Resume Active Shuttle</Button>
            </div>
          )}

          <Button 
            type="submit" 
            loading={loading}
            loadingText="Securing Seat..."
            className="w-full h-16 text-lg font-black uppercase tracking-widest shadow-[0_20px_40px_rgba(34,197,94,0.15)]"
          >
            Confirm Shuttle Booking
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default RideRequestPage;
