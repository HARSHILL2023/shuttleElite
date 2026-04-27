import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, ChevronRight, Bus, Download, Filter } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';

const RideHistoryPage = () => {
  const navigate = useNavigate();

  const rides = [
    {
      id: 'REQ-9980',
      date: '24 Apr 2026',
      time: '09:15',
      pickup: 'HSR Layout, Block 2',
      drop: 'Main Gate, Sector 62',
      status: 'Completed',
      shuttle: 'SH-102',
      carbon: '3.2kg'
    },
    {
      id: 'REQ-9952',
      date: '23 Apr 2026',
      time: '18:40',
      pickup: 'Main Gate, Sector 62',
      drop: 'HSR Layout, Block 2',
      status: 'Completed',
      shuttle: 'SH-204',
      carbon: '2.8kg'
    },
    {
      id: 'REQ-9921',
      date: '22 Apr 2026',
      time: '09:10',
      pickup: 'HSR Layout, Block 2',
      drop: 'Main Gate, Sector 62',
      status: 'Completed',
      shuttle: 'SH-102',
      carbon: '3.1kg'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-text-main tracking-tighter">Ride History</h1>
          <p className="text-text-muted font-medium mt-1">Review your past sustainable commutes</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button 
            variant="secondary" 
            className="flex-1 sm:flex-none"
            onClick={() => alert('Filter options: Date range, Shuttle ID, Route.')}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 sm:flex-none"
            onClick={() => alert('Preparing CSV/PDF export for your ride history...')}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-6">
        {rides.map((ride) => (
          <Card 
            key={ride.id} 
            onClick={() => alert(`Showing receipt and details for ride ${ride.id}`)}
            className="group relative overflow-hidden transition-all duration-500 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white/5 rounded-[1.25rem] border border-white/5 flex items-center justify-center text-text-dim group-hover:bg-primary/10 group-hover:text-primary transition-all group-hover:rotate-6">
                  <Bus className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black text-text-main tracking-tight">{ride.shuttle}</span>
                    <span className="text-[10px] font-black text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full uppercase tracking-widest">
                      {ride.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-muted font-bold mt-1.5 uppercase tracking-tighter">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> {ride.date}
                    </span>
                    <span className="w-1.5 h-1.5 bg-white/10 rounded-full" />
                    <span>{ride.time}</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 md:px-8 border-l border-white/5 space-y-3">
                <div className="flex items-center gap-3 group/item">
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-primary group-hover/item:scale-125 transition-transform" />
                  <span className="text-text-main font-bold tracking-tight text-sm">{ride.pickup}</span>
                </div>
                <div className="flex items-center gap-3 group/item">
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-red-400 group-hover/item:scale-125 transition-transform" />
                  <span className="text-text-main font-bold tracking-tight text-sm">{ride.drop}</span>
                </div>
              </div>

              <div className="flex items-center justify-between md:flex-col md:items-end gap-2 md:min-w-[120px]">
                <div className="text-right">
                  <p className="text-[10px] font-black text-text-dim uppercase tracking-widest">CO2 Saved</p>
                  <p className="text-lg font-black text-primary tracking-tighter">{ride.carbon}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono text-text-dim font-bold">{ride.id}</span>
                  <div className="w-10 h-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-text-muted group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination / Load More */}
      <div className="pt-10 flex flex-col items-center gap-4">
        <p className="text-text-dim text-sm font-bold uppercase tracking-[0.2em]">End of History</p>
        <div className="w-12 h-1 bg-white/5 rounded-full" />
      </div>
    </div>
  );
};

export default RideHistoryPage;
