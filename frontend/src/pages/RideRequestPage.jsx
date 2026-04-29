import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Clock, Calendar, ChevronLeft, Info, Sparkles, Navigation } from 'lucide-react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import SEO from '../components/SEO';
import toast from 'react-hot-toast';
import { rideService } from '../services/rideService';

const RideRequestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    pickup: '',
    drop: location.state?.route || '',
    time: '18:00',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const geocodeLocation = async (address) => {
    return new Promise((resolve, reject) => {
      if (!window.google) {
        reject(new Error("Strategic failure: Satellite network offline."));
        return;
      }
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ 
        address,
        componentRestrictions: { country: 'IN' } // Prioritize India region as requested
      }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const { lat, lng } = results[0].geometry.location;
          const coords = { lat: lat(), lng: lng() };
          console.log(`ROUTE LOCATION FOR "${address}":`, coords.lat, coords.lng);
          resolve(coords);
        } else {
          reject(new Error(`Could not locate objective: ${address}`));
        }
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Strict Geocoding: Convert text to tactical coordinates
      const [pickupCoords, dropCoords] = await Promise.all([
        geocodeLocation(formData.pickup),
        geocodeLocation(formData.drop)
      ]);

      // 2. Submit mission with precise coordinates
      const data = await rideService.requestRide(
        formData.pickup,
        formData.drop,
        formData.date,
        formData.time,
        pickupCoords,
        dropCoords
      );

      if (data.ride) {
        toast.success("Elite ride request accepted");
        navigate('/tracking');
      } else {
        const msg = data.message || "Request failed";
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      const errorMsg = err.message || "Strategic network failure. Check encrypted connection.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-700">
      <SEO
        title="Book a Ride"
        description="Request your ShuttleElite corporate mobility asset. Fast, secure, and elite tactical deployment."
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "ShuttleElite Ride Request",
          "description": "Book a premium corporate shuttle with real-time GPS tracking."
        }}
      />
      {/* Header */}
      <div className="flex items-center gap-6">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-card border border-border hover:bg-card-hover rounded-2xl transition-all group"
        >
          <ChevronLeft className="w-6 h-6 text-text-muted group-hover:text-primary" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-text-main tracking-tight uppercase italic">Initiate <span className="text-primary">Pursuit</span></h1>
          <p className="text-text-muted font-medium">Request elite mobility resources</p>
        </div>
      </div>

      <Card className="relative overflow-hidden group border-white/5!">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] -rotate-12">
          <Sparkles size={120} />
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
          {/* Location Selection */}
          <div className="space-y-8 relative">
            <div className="absolute left-[23px] top-12 bottom-12 w-[2px] bg-gradient-to-b from-primary via-primary/20 to-red-400 opacity-20" />
            
            <div className="flex items-start gap-6">
              <div className="mt-1 w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center z-10 shrink-0 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <Input
                  label="Pickup Logistics"
                  placeholder="Enter pickup address"
                  value={formData.pickup}
                  onChange={(e) => setFormData({...formData, pickup: e.target.value})}
                  required
                  className="h-14 bg-white/5 border-white/5!"
                />
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="mt-1 w-12 h-12 rounded-2xl bg-red-400/10 border border-red-400/20 flex items-center justify-center z-10 shrink-0 group-hover:scale-110 transition-transform">
                <Navigation className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <Input
                  label="Mission Destination"
                  placeholder="Where is the objective?"
                  value={formData.drop}
                  onChange={(e) => setFormData({...formData, drop: e.target.value})}
                  required
                  className="h-14 bg-white/5 border-white/5!"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/5">
            <div className="flex items-start gap-6">
              <div className="mt-1 w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6 text-text-muted" />
              </div>
              <div className="flex-1">
                <Input
                  label="Operation Date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                  className="h-14 bg-white/5 border-white/5!"
                />
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="mt-1 w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-text-muted" />
              </div>
              <div className="flex-1">
                <Input
                  label="Window of Deployment"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  required
                  className="h-14 bg-white/5 border-white/5!"
                />
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-primary/5 p-6 rounded-2xl flex gap-4 border border-primary/10">
            <div className="mt-1">
              <Info className="w-6 h-6 text-primary shrink-0" />
            </div>
            <p className="text-sm text-text-muted leading-relaxed font-medium">
              <span className="text-primary font-bold">Elite Resource Allocation:</span> Our system dynamically assigns the highest rated driver for your route. 
              Assets are locked instantly upon request confirmation.
            </p>
          </div>

          {/* Error Message with Resume Link */}
          {error && (
            <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex flex-col gap-3 animate-in slide-in-from-top-4">
              <p className="text-red-500 text-sm font-bold uppercase tracking-tight">{error}</p>
              <Button 
                variant="outline" 
                className="w-full h-10 text-[10px] uppercase border-red-500/20 text-red-500 hover:bg-red-500/10"
                onClick={() => navigate('/tracking')}
              >
                Resume Active Operation
              </Button>
            </div>
          )}

          <Button 
            type="submit" 
            loading={loading}
            loadingText="Syncing Resources..."
            className="w-full h-16 text-lg font-black uppercase tracking-widest shadow-[0_20px_40px_rgba(34,197,94,0.15)]"
          >
            Confirm Tactical Pursuit
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default RideRequestPage;
