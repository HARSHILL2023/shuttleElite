import { Phone, MapPin, Star, Bus } from 'lucide-react';
import toast from 'react-hot-toast';

const DriverInfoCard = ({ ride }) => {
  const getSinceTime = () => "20 mins ago";

  return (
    <div className="bg-white p-4 border-t border-slate-100 animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center gap-4">
        {/* Bus Profile Pic */}
        <div className="relative shrink-0">
          <img 
            src="/bus.png" 
            alt="Shuttle Elite Bus" 
            className="w-16 h-16 p-1 rounded-2xl bg-slate-900 object-contain border-2 border-primary shadow-lg shadow-primary/10"
          />
          <div className="absolute -bottom-1 -right-1 bg-primary text-slate-900 rounded-full p-1 border-2 border-white">
             <Bus size={10} fill="currentColor" />
          </div>
        </div>

        {/* Bus Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-xl font-black text-slate-800 truncate tracking-tight leading-none uppercase italic">SHUTTLE <span className="text-primary">ELITE-01</span></h4>
          <p className="text-[10px] text-slate-500 font-black truncate uppercase tracking-[0.1em] mt-2">
            KA12 W 3456 • {ride?.driverInfo?.shuttlePlate || 'KA-01-MJ-5542'}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Logged in 10:00 AM</p>
            <span className="w-1 h-1 bg-slate-200 rounded-full" />
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">5th Ride Today</p>
          </div>
        </div>

        {/* Call Button */}
        <button 
          onClick={() => toast.success('Initiating call to Jasbeer...')}
          className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm text-slate-600"
        >
          <Phone size={20} className="fill-slate-100" />
        </button>
      </div>

      {/* Status Bar */}
      <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-50">
        <div className="bg-green-600 text-white text-[9px] font-black px-3 py-1 rounded-sm uppercase tracking-[0.15em]">
          IN BOOKING
        </div>
        <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">
          Active {getSinceTime()} • {ride?.status?.replace('_', ' ')}
        </p>
      </div>
    </div>
  );
};

export default DriverInfoCard;
