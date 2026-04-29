import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import MapWidget from '../components/MapWidget';
import DriverInfoCard from '../components/DriverInfoCard';

const LiveTrackingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(480); // 8 mins in seconds
  const [status, setStatus] = useState('On the way');
  const [isWaiting, setIsWaiting] = useState(false);
  const [isDeparted, setIsDeparted] = useState(false);
  const [departureTime, setDepartureTime] = useState(0);

  useEffect(() => {
    // Simulate initial loading
    const loadTimer = setTimeout(() => setLoading(false), 1500);
    
    const timer = setInterval(() => {
      if (!loading) {
        if (timeLeft > 0) {
          setTimeLeft((prev) => {
            const next = prev - 1;
            if (next <= 120 && next > 0) setStatus('Arriving');
            if (next === 0) {
              setIsWaiting(true);
              setStatus('Driver arrived. Will leave in 2 minutes');
            }
            return next;
          });
        } else if (isWaiting) {
          setIsWaiting(false);
          setIsDeparted(true);
          setStatus('Driver has left');
        } else if (isDeparted) {
          setDepartureTime(prev => prev + 1);
        }
      }
    }, 1000);

    return () => {
      clearTimeout(loadTimer);
      clearInterval(timer);
    };
  }, [loading, timeLeft, isWaiting, isDeparted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-card rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[500px] bg-card rounded-3xl" />
          <div className="space-y-6">
            <div className="h-64 bg-card rounded-3xl" />
            <div className="h-16 bg-card rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 pb-32 md:pb-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-card border border-border hover:bg-card-hover rounded-2xl transition-all group"
          >
            <ChevronLeft className="w-6 h-6 text-text-muted group-hover:text-primary" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-text-main tracking-tight">Live Tracking</h1>
            <p className="text-text-muted text-sm font-medium">Route: Tech Park → Downtown</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-primary/10 px-5 py-2 rounded-2xl border border-primary/20">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-primary font-bold text-sm tracking-wider uppercase">Live Connection</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <MapWidget 
            status={status}
            pickup="Tech Park, Bangalore"
            drop="MG Road, Bangalore"
          />
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          <Card className="relative overflow-hidden group">
            {/* Arrival Banner */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20">
              <div 
                className="h-full bg-primary transition-all duration-1000" 
                style={{ width: `${(isDeparted ? 1 : (1 - timeLeft/480)) * 100}%` }} 
              />
            </div>

            <div className="text-center space-y-2 py-4">
              <div className="flex items-center justify-center gap-2 text-text-muted text-sm font-bold uppercase tracking-[0.2em] mb-2">
                <Clock className="w-4 h-4 text-primary" />
                {isWaiting ? 'WAITING' : isDeparted ? 'STATUS' : 'ETA'}
              </div>
              <p className="text-6xl font-black text-text-main tracking-tighter tabular-nums uppercase">
                {isWaiting ? 'HERE' : isDeparted ? 'GONE' : formatTime(timeLeft).split(' ')[0]}
              </p>
              <p className="text-text-dim text-lg font-bold tracking-tight">
                {isWaiting ? 'Driver is waiting' : isDeparted ? 'Ride completed' : `${formatTime(timeLeft).split(' ')[1]} remaining`}
              </p>
              
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-2xl transition-all duration-500">
                <span className={`w-2 h-2 rounded-full ${isWaiting ? 'bg-blue-500 animate-pulse' : isDeparted ? 'bg-red-500' : 'bg-primary animate-pulse'}`} />
                <span className="text-primary font-black text-sm uppercase tracking-widest">{status}</span>
              </div>
            </div>

            {/* Driver & Shuttle Info */}
            <DriverInfoCard />
          </Card>
          
          <Button 
            variant="danger" 
            className="w-full py-4 rounded-2xl group"
            onClick={() => {
              if(confirm('Are you sure you want to cancel this ride? A cancellation fee may apply.')) {
                navigate('/dashboard');
              }
            }}
          >
            <span className="group-hover:scale-105 transition-transform">Cancel My Ride</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LiveTrackingPage;
