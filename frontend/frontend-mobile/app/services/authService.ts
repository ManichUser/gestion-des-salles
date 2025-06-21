import axios from 'axios';
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "http://192.168.186.213:8083/api/auth"; // ⚠️ IP locale du backend (doit être visible par téléphone)
const apiClass = axios.create({
    baseURL: 'http://192.168.186.213:8084/api', // ton backend
  });

export const registerUser = async (user: any) => {
  const response = await axios.post(`${API_URL}/register`, user);
  return response.data;
};

export const loginUser = async ({ email, password }: { email: string; password: string }) => {
  const response = await api.post('/auth/login', { email, password });
  

  await AsyncStorage.setItem('token', response.data.token);

  return response.data;
};

export const getSalleDeClasse=async ()=>{
        const response= await apiClass.get('/classrooms')
        return response.data
}