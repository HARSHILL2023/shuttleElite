import { useQuery } from '@tanstack/react-query';
import { rideService } from '../services/rideService';

export const useActiveRide = (pollInterval = 2000) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['active-ride'],
    queryFn: rideService.getActiveRide,
    refetchInterval: pollInterval,
    select: (data) => data?.ride ?? null,
    retry: 1,
  });

  return {
    activeRide: data ?? null,
    loading: isLoading,
    error: error?.message ?? null,
    refresh: refetch,
  };
};
