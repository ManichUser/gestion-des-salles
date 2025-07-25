import axios from 'axios';
import api from './api'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_API_URL = "http://192.168.137.135:8081"; 


export const registerUser = async (user: { lastname: string; firstname: string; username: string; email: string; password: string; filiere: string; niveau: string; }) => { // user: { firstName, lastName, email, password, role }
  const response = await axios.post(`${AUTH_API_URL}/api/auth/register`, user); // Utilise AUTH_API_URL directement si 'api' n'est pas pour l'auth
  return response.data;
};

export const loginUser = async ({ email, password }: { email: string; password: string }) => { 

  const response = await api.post('/auth/login', { email, password });
  await AsyncStorage.setItem('token', response.data.token);
  await AsyncStorage.setItem('refreshToken', response.data.refreshToken); 
  return response.data;
};

export const getAuthenticatedUser = async () => {
  const token = await AsyncStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  const response = await api.get('/auth/me'); 
  return response.data;
};

export const logoutUser = async () => {
  const token = await AsyncStorage.getItem('token');
  if (!token) {
    // Si pas de token, l'utilisateur est déjà déconnecté (ou n'était pas connecté)
    console.warn("Attempted to logout but no token was found.");
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('refreshToken');
    return;
  }
  try {
    // Le backend vérifie le token dans l'en-tête, donc 'api' est idéal s'il a l'intercepteur.
    // Ou manuellement: axios.post(`${AUTH_API_URL}/api/auth/logout`, {}, { headers: { Authorization: `Bearer ${token}` } });
    await api.post('/auth/logout', {});
  } catch (error) {
    console.error("Error during logout API call:", error);
    // Gérer l'erreur (ex: token expiré sur le serveur) mais effacer quand même le token local
  } finally {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('refreshToken');
  }
};

export const refreshToken = async () => {
  const refreshTokenValue = await AsyncStorage.getItem('refreshToken');
  if (!refreshTokenValue) {
    throw new Error('No refresh token found');
  }
  const response = await axios.post(`${AUTH_API_URL}/api/auth/refresh`, { refreshToken: refreshTokenValue });
  await AsyncStorage.setItem('token', response.data.token);
  await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await axios.post(`${AUTH_API_URL}/api/auth/forgot-password?email=${email}`);
  return response.data;
};



export const getUsersByStatus = async (status: any) => { // status: string (ex: 'ACTIVE', 'INACTIVE')
    const response = await api.get(`/auth/users/status/${status}`);
    return response.data;
};


