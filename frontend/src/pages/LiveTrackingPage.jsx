import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Bus, Clock, ChevronLeft, Phone, MessageSquare, Navigation, ShieldCheck, Star } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';

const LiveTrackingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(480); // 8 mins in seconds
  const [status, setStatus] = useState('On the way');
  const [isWaiting, setIsWaiting] = useState(false);
  const [waitTimer, setWaitTimer] = useState(60); // 1 minute wait
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
          setWaitTimer((prev) => {
            const next = prev - 1;
            if (next === 0) {
              setIsWaiting(false);
              setIsDeparted(true);
              setStatus('Driver has left');
            }
            return next;
          });
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
        {/* Map Placeholder */}
        <div className="lg:col-span-2 h-[450px] md:h-[600px] bg-[#0F172A] rounded-[2.5rem] relative overflow-hidden border border-white/5 shadow-2xl group">
          {/* Mock Map Background - Dark Theme */}
          <div className="absolute inset-0 opacity-20" 
               style={{ 
                 backgroundImage: 'radial-gradient(#22C55E 0.5px, transparent 0.5px)', 
                 backgroundSize: '30px 30px' 
               }} />
          
          {/* Animated Route Path */}
          <svg className="absolute inset-0 w-full h-full text-primary/10" viewBox="0 0 800 600">
            <path 
              id="route-path"
              d="M 100 500 Q 300 450 400 300 T 700 100" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="4" 
              strokeLinecap="round" 
              strokeDasharray="10 10" 
            />
          </svg>

          {/* User Location Indicator */}
          <div className="absolute left-[100px] bottom-[100px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="bg-card px-3 py-1.5 rounded-xl border border-border shadow-xl mb-3 text-[10px] font-bold text-text-main whitespace-nowrap">
              Your Stop
            </div>
            <div className="relative">
              <div className="w-6 h-6 bg-blue-500/20 rounded-full animate-ping absolute -inset-0" />
              <div className="w-6 h-6 bg-blue-500 rounded-full border-4 border-[#0F172A] shadow-lg relative flex items-center justify-center">
                <MapPin className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>

          {/* Shuttle Location Indicator */}
          {(() => {
            const totalEnroute = 480;
            const tp = 1 - (timeLeft / totalEnroute);
            
            // Easing: easeOutCubic to slow down as it gets closer
            const easedTp = 1 - Math.pow(1 - tp, 1.5);
            
            const getBezier = (t, p0, p1, p2) => {
              const invT = 1 - t;
              const pos = invT * invT * p0 + 2 * invT * t * p1 + t * t * p2;
              const der = 2 * invT * (p1 - p0) + 2 * t * (p2 - p1);
              return [pos, der];
            };

            let x, y, dx, dy;
            
            if (!isDeparted) {
              if (easedTp < 0.5) {
                const s = easedTp * 2;
                const [posX, derX] = getBezier(s, 700, 500, 400);
                const [posY, derY] = getBezier(s, 100, 150, 300);
                x = posX; y = posY; dx = derX; dy = derY;
              } else {
                const s = (easedTp - 0.5) * 2;
                const [posX, derX] = getBezier(s, 400, 300, 100);
                const [posY, derY] = getBezier(s, 300, 450, 500);
                x = posX; y = posY; dx = derX; dy = derY;
              }
            } else {
              // Move away after departure
              const departTp = Math.min(departureTime / 10, 1);
              x = 100 - departTp * 150;
              y = 500 + departTp * 50;
              dx = -150; dy = 50;
            }

            const rotation = Math.atan2(dy, dx) * (180 / Math.PI);

            return (
              <div 
                className={`absolute transition-all duration-1000 linear flex flex-col items-center ${isDeparted && departureTime > 5 ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                style={{ 
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: 'translate(-50%, -50%)',
                  transitionProperty: 'left, top, opacity, transform',
                  zIndex: 20
                }}
              >
                <div className="bg-primary px-3 py-2 rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.4)] mb-3 flex items-center gap-2">
                  <Bus className="w-4 h-4 text-black" />
                  <span className="text-black text-[11px] font-black whitespace-nowrap uppercase tracking-tighter">
                    {isWaiting ? 'Arrived' : isDeparted ? 'Departed' : `SH-204 • ${Math.ceil(timeLeft/60)}m`}
                  </span>
                </div>
                <div 
                  className={`w-10 h-10 bg-primary rounded-full border-4 border-[#0F172A] shadow-2xl flex items-center justify-center transition-transform duration-1000 ${isWaiting ? 'animate-bounce-subtle' : ''}`}
                  style={{ transform: `rotate(${rotation - 45}deg)` }}
                >
                  <Navigation className="w-5 h-5 text-black" />
                </div>
              </div>
            );
          })()}

          {/* Map Controls Mock */}
          <div className="absolute top-6 right-6 flex flex-col gap-3">
            {[
              { id: 'zoom-in', icon: '+' },
              { id: 'zoom-out', icon: '-' },
              { id: 'recenter', icon: '◎' }
            ].map(ctrl => (
              <button 
                key={ctrl.id} 
                onClick={() => alert(`Map ${ctrl.id} interaction triggered.`)}
                className="w-10 h-10 bg-card/80 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center text-text-muted hover:text-primary cursor-pointer transition-colors font-bold"
              >
                {ctrl.icon}
              </button>
            ))}
          </div>
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
            <div className="space-y-6 mt-8 pt-8 border-t border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                      alt="Driver" 
                      className="w-14 h-14 rounded-2xl bg-card-hover border border-border"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-primary p-1 rounded-lg border-2 border-card">
                      <ShieldCheck className="w-3 h-3 text-black" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-text-main font-bold">Rajesh Kumar</h4>
                    <div className="flex items-center gap-1.5 text-xs text-text-muted font-semibold mt-0.5">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      4.9 • 2,400+ Rides
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => alert('Initiating VOIP call to driver...')}
                    className="p-3 bg-white/5 hover:bg-primary/10 hover:text-primary border border-white/5 rounded-2xl transition-all"
                  >
                    <Phone className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => alert('Opening secure chat with driver...')}
                    className="p-3 bg-white/5 hover:bg-primary/10 hover:text-primary border border-white/5 rounded-2xl transition-all"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="bg-white/5 p-5 rounded-2xl space-y-4 border border-white/5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted font-medium">Shuttle ID</span>
                  <span className="font-bold text-text-main font-mono">SH-204 (KA-01-MJ-5542)</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted font-medium">Model</span>
                  <span className="font-bold text-text-main">Toyota Coaster Luxe</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted font-medium">Occupancy</span>
                  <div className="flex gap-1.5">
                    {[1,2,3,4].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-primary/60 shadow-[0_0_8px_rgba(34,197,94,0.3)]" />)}
                    {[1].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-white/10" />)}
                  </div>
                </div>
              </div>
            </div>
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
