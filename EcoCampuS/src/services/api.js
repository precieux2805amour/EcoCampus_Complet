import axios from 'axios';
import { getToken } from '../utils/tokenUtils';


const api = axios.create({
  baseURL:'http://10.228.243.126:3000',
});

api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
