import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://192.168.43.187:8081/api', // ton backend
});

// Intercepteur pour ajouter le token automatiquement
api.interceptors.request.use(
  async (config) => {
      // Liste des chemins qui ne nécessitent PAS de token (login, register, forgot-password, reset-password)
      const publicPaths = [
          '/auth/login',
          '/auth/register',
          '/auth/forgot-password',
          '/auth/reset-password',
          '/auth/refresh' 
      ];

      // Vérifie si l'URL de la requête actuelle est une des routes publiques
      // On utilise config.url car il contient le chemin relatif
      const isPublicPath = publicPaths.some(path => config.url?.endsWith(path));

      // Si ce n'est PAS une route publique, ou si c'est une route publique mais qu'on veut quand même un token (ex: logout)
      // Pour logout, le backend peut exiger un token pour révoquer l'ancien
      // Pour login/register/forgot-password/reset-password, on ne doit PAS envoyer de token
      if (!isPublicPath) {
        const token = await AsyncStorage.getItem('token');
          if (token) {
              config.headers.Authorization = `Bearer ${token}`;
          }
      }
      return config;
  },
  (error) => Promise.reject(error)
);


export default api;
