  import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Bus, Star, ShieldCheck } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';

const RideConfirmationPage = () => {
  const navigate = useNavigate();

  const rideInfo = {
    id: 'REQ-9981',
    shuttle: 'White Toyota Coaster Luxe',
    plate: 'KA-01-MJ-5542',
    driver: 'Rajesh Kumar',
    rating: '4.8',
    eta: '8 mins',
    pickup: 'Main Gate, Sector 62',
    time: '18:35'
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10 animate-in zoom-in-95 duration-700">
      <div className="text-center space-y-4 py-8">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-primary/10 border border-primary/20 mb-4 shadow-[0_0_50px_rgba(34,197,94,0.2)]">
          <CheckCircle2 className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-5xl font-black text-text-main tracking-tighter">Ride Confirmed!</h1>
        <p className="text-text-muted text-lg font-medium">Your elite commute is scheduled and secured.</p>
      </div>

      <Card className="relative overflow-hidden group">
        {/* Progress header */}
        <div className="bg-primary p-8 text-black flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-black/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <Bus className="w-8 h-8 text-black" />
            </div>
            <div>
              <p className="text-[10px] font-black text-black/60 uppercase tracking-[0.2em]">Assignment ID</p>
              <p className="text-xl font-black">{rideInfo.id}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-black/60 uppercase tracking-[0.2em]">Estimated ETA</p>
            <p className="text-3xl font-black tabular-nums">{rideInfo.eta}</p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Driver Info */}
          <div className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-3xl">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                  alt="Driver" 
                  className="w-16 h-16 rounded-2xl bg-card border border-border"
                />
                <div className="absolute -bottom-1 -right-1 bg-primary p-1 rounded-lg border-2 border-card">
                  <ShieldCheck className="w-3.5 h-3.5 text-black" />
                </div>
              </div>
              <div>
                <p className="text-lg font-black text-text-main tracking-tight">{rideInfo.driver}</p>
                <div className="flex items-center gap-1.5 text-xs font-bold text-text-muted mt-0.5 uppercase tracking-tighter">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  {rideInfo.rating} Rating • Professional Driver
                </div>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-text-main font-mono tracking-tighter">{rideInfo.plate}</p>
              <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mt-1">{rideInfo.shuttle}</p>
            </div>
          </div>

          {/* Journey Details */}
          <div className="space-y-6 relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-white/5" />
            
            <div className="flex items-start gap-5">
              <div className="mt-1.5 w-4 h-4 rounded-full border-2 border-primary bg-background z-10" />
              <div>
                <p className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em] mb-1">Pickup Point</p>
                <p className="text-lg font-bold text-text-main tracking-tight">{rideInfo.pickup}</p>
              </div>
            </div>
            <div className="flex items-start gap-5">
              <div className="mt-1.5 w-4 h-4 rounded-full border-2 border-white/10 bg-background z-10" />
              <div>
                <p className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em] mb-1">Departure Time</p>
                <p className="text-lg font-bold text-text-main tracking-tight">Today, {rideInfo.time}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 pt-0 flex flex-col sm:flex-row gap-4">
          <Button variant="secondary" className="h-14 sm:flex-1" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
          <Button className="h-14 sm:flex-[2]" onClick={() => navigate('/tracking')}>
            Start Live Tracking
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default RideConfirmationPage;
