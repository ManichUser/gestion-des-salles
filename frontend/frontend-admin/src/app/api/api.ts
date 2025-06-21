
import axios from 'axios';
import { getCookie } from 'cookies-next';

export const api = axios.create({
  baseURL: 'http://localhost:8083/api', // ou ton IP locale si besoin
});


api.interceptors.request.use(
  (config) => {
    const token = getCookie('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export const apiClass = axios.create({
    baseURL: 'http://localhost:8084/api',
  });
  

