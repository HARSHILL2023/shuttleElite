import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, ChevronRight, Bus, Download, Filter, Loader2 } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import SEO from '../components/SEO';
import { rideService } from '../services/rideService';
import toast from 'react-hot-toast';

const RideHistoryPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['ride-history'],
    queryFn: rideService.getHistory,
    select: (data) => data?.rides ?? []
  });

  const rides = data ?? [];

  const updateMutation = useMutation({
    mutationFn: ({ rideId, status }) => rideService.updateStatus(rideId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ride-history'] });
      toast.success('Ride status updated');
    },
    onError: () => toast.error('Error updating status'),
  });

  const handleUpdateStatus = (e, rideId, newStatus) => {
    e.stopPropagation();
    updateMutation.mutate({ rideId, status: newStatus });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'confirmed': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'completed': return 'text-green-500 bg-green-500/10 border-green-500/20';
      default: return 'text-primary bg-primary/10 border-primary/20';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <SEO
        title="Mission History"
        description="Review your complete ShuttleElite ride history, CO2 savings, and tactical operation records."
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "ShuttleElite Mission History",
          "description": "Your personal corporate ride history with ShuttleElite."
        }}
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-text-main tracking-tighter uppercase italic">Mission <span className="text-primary">History</span></h1>
          <p className="text-text-muted font-medium mt-1">Review your past elite operations</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button 
            variant="secondary" 
            className="flex-1 sm:flex-none"
            onClick={() => toast('Filter features coming soon!')}
            aria-label="Filter ride history"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-6" role="list" aria-label="Ride history">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4" aria-live="polite">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-text-muted font-bold animate-pulse uppercase tracking-widest text-xs">Fetching operation records...</p>
          </div>
        ) : isError ? (
          <Card className="border-red-500/20 bg-red-500/5 py-10 text-center" role="alert">
            <p className="text-red-500 font-bold mb-4">Failed to load mission history</p>
            <Button onClick={() => refetch()} variant="secondary">Try Again</Button>
          </Card>
        ) : rides.length === 0 ? (
          <Card className="text-center py-20 bg-white/[0.02]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
                <Bus className="w-10 h-10 text-text-dim" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-text-main">No missions recorded</h3>
                <p className="text-text-muted mt-2">Your elite operation log is empty.</p>
              </div>
              <Button onClick={() => navigate('/request')} className="mt-4" aria-label="Book your first ride">
                Deploy First Mission
              </Button>
            </div>
          </Card>
        ) : rides.map((ride) => (
          <Card 
            key={ride._id}
            role="listitem"
            onClick={() => toast.success(`Operation: REQ-${ride._id.slice(-4).toUpperCase()}`)}
            className="group relative overflow-hidden transition-all duration-500 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white/5 rounded-[1.25rem] border border-white/5 flex items-center justify-center text-text-dim group-hover:bg-primary/10 group-hover:text-primary transition-all group-hover:rotate-6">
                  <Bus className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black text-text-main tracking-tight">SH-Elite</span>
                    <span className={`text-[10px] font-black border px-3 py-1 rounded-full uppercase tracking-widest ${getStatusColor(ride.status)}`}>
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
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-primary" />
                  <span className="text-text-main font-bold tracking-tight text-sm">{ride.pickupName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-red-400" />
                  <span className="text-text-main font-bold tracking-tight text-sm">{ride.dropName}</span>
                </div>
              </div>

              <div className="flex items-center justify-between md:flex-col md:items-end gap-3 md:min-w-[140px]">
                <div className="text-right">
                  <p className="text-[10px] font-black text-text-dim uppercase tracking-widest">CO2 Saved</p>
                  <p className="text-lg font-black text-primary tracking-tighter">3.2kg</p>
                </div>
                <div className="flex items-center gap-4">
                  {ride.status !== 'completed' && (
                    <button 
                      onClick={(e) => handleUpdateStatus(e, ride._id, 'completed')}
                      disabled={updateMutation.isPending}
                      aria-label="Mark ride as completed"
                      className="text-[10px] font-black text-primary uppercase tracking-widest border border-primary/20 bg-primary/5 hover:bg-primary hover:text-black px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
                    >
                      Complete
                    </button>
                  )}
                  <div className="w-10 h-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-text-muted group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {rides.length > 0 && (
        <div className="pt-10 flex flex-col items-center gap-4">
          <p className="text-text-dim text-sm font-bold uppercase tracking-[0.2em]">End of Records</p>
          <div className="w-12 h-1 bg-white/5 rounded-full" />
        </div>
      )}
    </div>
  );
};

export default RideHistoryPage;
