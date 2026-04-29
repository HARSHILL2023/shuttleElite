import apiClient from '../utils/apiClient';

export const authService = {
  async getMe() {
    const res = await apiClient.get('/auth/me');
    return res.data;
  }
};
