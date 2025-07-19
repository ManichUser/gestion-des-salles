import axios from 'axios';
import { getCookie } from 'cookies-next';

export const api = axios.create({
    baseURL: 'http://localhost:8081/api', // ou ton IP locale si besoin
});

export const apiPlanning = axios.create({
    baseURL: 'http://localhost:8082/api'
});

export const apiClass = axios.create({
    baseURL: 'http://localhost:8084/api',
});

// Intercepteur pour ajouter le token JWT aux requêtes, SAUF pour le login et l'enregistrement
api.interceptors.request.use(
    (config) => {
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
            const token = getCookie('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        // Pour les requêtes de login/register, on ne doit pas envoyer de token JWT dans l'Authorization header.
        // Si le token existe mais que c'est une route publique (login/register), on ne l'ajoute pas.
        // Si c'est la route de logout, le backend peut avoir besoin du token pour le révoquer.
        // Pour simplifier, on n'ajoute le token que si ce n'est pas une route publique.

        // Cas particulier pour le logout: le backend peut nécessiter le token pour le révoquer.
        // Si c'est le cas, il faudrait une logique plus fine ou un intercepteur spécifique pour logout.
        // Pour l'instant, la règle "pas de token sur les routes publiques" est la plus sûre pour login/register.

        return config;
    },
    (error) => Promise.reject(error)
);