import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Clock, Calendar, ChevronLeft, Info, Sparkles } from 'lucide-react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

const RideRequestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    pickup: '',
    drop: location.state?.route || '',
    time: '',
    date: '2026-04-25',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch("http://localhost:5000/api/rides/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          pickup: formData.pickup,
          drop: formData.drop,
          date: formData.date,
          time: formData.time
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Ride booked successfully");
        navigate('/confirm');
      } else {
        setError(data.message || "Failed to book ride");
      }
    } catch (err) {
      setError("Something went wrong. Please check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-6">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-card border border-border hover:bg-card-hover rounded-2xl transition-all group"
        >
          <ChevronLeft className="w-6 h-6 text-text-muted group-hover:text-primary" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-text-main tracking-tight">Request Ride</h1>
          <p className="text-text-muted font-medium">Plan your next elite commute</p>
        </div>
      </div>

      <Card className="relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] -rotate-12">
          <Sparkles size={120} />
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
          {/* Location Selection */}
          <div className="space-y-8 relative">
            {/* Visual connector line */}
            <div className="absolute left-[23px] top-12 bottom-12 w-[2px] bg-gradient-to-b from-primary via-primary/20 to-red-400 opacity-20" />
            
            <div className="flex items-start gap-6">
              <div className="mt-1 w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center z-10 shrink-0 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <Input
                  label="Pickup Point"
                  placeholder="Select pickup location"
                  value={formData.pickup}
                  onChange={(e) => setFormData({...formData, pickup: e.target.value})}
                  required
                  className="h-14 bg-white/5 border-white/5!"
                />
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="mt-1 w-12 h-12 rounded-2xl bg-red-400/10 border border-red-400/20 flex items-center justify-center z-10 shrink-0 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <Input
                  label="Destination"
                  placeholder="Where are you heading?"
                  value={formData.drop}
                  onChange={(e) => setFormData({...formData, drop: e.target.value})}
                  required
                  className="h-14 bg-white/5 border-white/5!"
                />
              </div>
            </div>
          </div>

          {/* Time & Date Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/5">
            <div className="flex items-start gap-6">
              <div className="mt-1 w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6 text-text-muted" />
              </div>
              <div className="flex-1">
                <Input
                  label="Date"
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
                  label="Preferred Time"
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
              <span className="text-primary font-bold">Elite Optimization:</span> Our AI dynamically assigns the best shuttle for your route. 
              Seats are reserved instantly upon request.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            loading={loading}
            loadingText="Booking Shuttle..."
            className="w-full h-16 text-lg font-black uppercase tracking-widest"
          >
            Confirm Shuttle Request
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default RideRequestPage;
