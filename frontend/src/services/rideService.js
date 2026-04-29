import apiClient from '../utils/apiClient';

export const rideService = {
  async getActiveRide() {
    const res = await apiClient.get('/rides/active');
    return res.data;
  },

  async requestRide(pickup, drop, date, time, pickupLocation, dropLocation) {
    const res = await apiClient.post('/rides/request', { 
      pickup, drop, date, time, pickupLocation, dropLocation 
    });
    return res.data;
  },

  async updateStatus(rideId, status) {
    const res = await apiClient.put(`/rides/${rideId}/status`, { status });
    return res.data;
  },

  async getHistory() {
    const res = await apiClient.get('/rides/history');
    return res.data;
  }
};
