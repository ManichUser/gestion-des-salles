import { getCookie, setCookie } from 'cookies-next';
import { api, apiClass, apiPlanning } from './api';


// --- Interfaces d'authentification et de gestion des utilisateurs ---
export interface AuthResponse {
    token: string;
    refreshToken: string;
    userId?: number;
    email?: string;
    role?: string;
}

export interface RegisterRequest {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: string; 
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RoleUpdateRequest {
    role: string; 
}

export interface StatusUpdateRequest {
    status: string; // Ex: "ACTIVE", "INACTIVE", "BLOCKED"
}

// Interface pour le rôle, car il est un objet dans votre réponse API
export interface Role {
    id: number;
    name: string;
}

// Interface pour les données utilisateur retournées par les endpoints GET /users
export interface UserResponse {
    id: number;
    firstname: string | null; // Peut être null selon votre JSON
    lastname: string | null;  // Peut être null selon votre JSON
    username: string;         // Ajouté : présent dans votre JSON
    email: string;
    role: Role;               // Corrigé : c'est un objet Role, pas une simple chaîne
    enabled: boolean;         // Ajouté : présent dans votre JSON
    status: string;           // Reste une chaîne, car c'est ce que votre JSON renvoie ("ACTIF")
    filiere: string | null;   // Ajouté : présent dans votre JSON, peut être null
    niveau: string | null;    // Ajouté : présent dans votre JSON, peut être null
    // Le champ 'password' est présent dans le JSON, mais ne devrait idéalement PAS être exposé
    // au frontend via cette interface pour des raisons de sécurité.
    // Assurez-vous qu'il est retiré de votre DTO Spring Boot envoyé au frontend.
}

export interface RefreshRequest {
    refreshToken: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}


// --- Fonctions d'Authentification ---

// POST /api/auth/register
export const registerUser = async (request: RegisterRequest): Promise<AuthResponse> => {
    try {
        const response = await api.post('/auth/register', request);
        // Souvent, l'enregistrement connecte aussi l'utilisateur et renvoie un token
        if (response.data.token) {
            setCookie('token', response.data.token, { maxAge: 60 * 60 * 24, path: '/' });
            if (response.data.refreshToken) {
                 setCookie('refreshToken', response.data.refreshToken, { maxAge: 60 * 60 * 24 * 7, path: '/' }); // Durée plus longue pour refresh
            }
        }
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'enregistrement :", error);
        throw error;
    }
};

// POST /api/auth/login (déjà présent, mais je le laisse pour la complétude)
export const loginAdmin = async ({ email, password }: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });

    setCookie('token', response.data.token, {
        maxAge: 60 * 60 * 24, // 1 jour
        path: '/',
    });
    // Si votre backend renvoie un refresh token, enregistrez-le aussi
    if (response.data.refreshToken) {
        setCookie('refreshToken', response.data.refreshToken, {
            maxAge: 60 * 60 * 24 * 7, // Ex: 7 jours pour le refresh token
            path: '/',
        });
    }

    return response.data;
};

// PUT /api/auth/role/{userId}
export const updateUserRole = async (userId: number, request: RoleUpdateRequest): Promise<string> => {
    const token = getCookie('token');
    if (!token) throw new Error("Jeton d'authentification manquant.");

    const response = await api.put(`/auth/role/${userId}`, request, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data; // Le backend renvoie "role updated to: [role_name]"
};

// PUT /api/auth/statut/{userId}
export const updateUserStatus = async (userId: number, request: StatusUpdateRequest): Promise<string> => {
    const token = getCookie('token');
    if (!token) throw new Error("Jeton d'authentification manquant.");

    const response = await api.put(`/auth/statut/${userId}`, request, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data; // Le backend renvoie "User status updated to [status]"
};

// GET /api/auth/users
export const getAllUsers = async (): Promise<UserResponse[]> => {
    const token = getCookie('token');
    console.log("Token récupéré pour getAllUsers:", token); // <-- AJOUTEZ CECI
    if (!token) throw new Error("Jeton d'authentification manquant.");

    const response = await api.get('/auth/users', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// GET /api/auth/users/role/{role}
export const getUsersByRole = async (role: string): Promise<UserResponse[]> => {
    const token = getCookie('token');
    if (!token) throw new Error("Jeton d'authentification manquant.");

    const response = await api.get(`/auth/users/role/${role}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// GET /api/auth/users/status/{status}
export const getUsersByStatus = async (status: string): Promise<UserResponse[]> => {
    const token = getCookie('token');
    if (!token) throw new Error("Jeton d'authentification manquant.");

    const response = await api.get(`/auth/users/status/${status}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// POST /api/auth/refresh
export const refreshToken = async (): Promise<AuthResponse> => {
    const refreshToken = getCookie('refreshToken'); // Récupérer le refresh token
    if (!refreshToken) throw new Error("Refresh token manquant.");

    const requestBody: RefreshRequest = { refreshToken: String(refreshToken) }; // Assurez-vous que c'est une chaîne
    const response = await api.post('/auth/refresh', requestBody);

    // Mettre à jour le nouveau token et refresh token (si fourni)
    setCookie('token', response.data.token, { maxAge: 60 * 60 * 24, path: '/' });
    if (response.data.refreshToken) {
        setCookie('refreshToken', response.data.refreshToken, { maxAge: 60 * 60 * 24 * 7, path: '/' });
    }
    return response.data;
};

// POST /api/auth/logout
export const logout = async (): Promise<string> => {
    const token = getCookie('token');
    if (!token) {
        // Si pas de token, on peut considérer l'utilisateur comme déconnecté côté client
        // Ou lever une erreur si le backend exige un token même pour la déconnexion
        console.warn("Pas de token trouvé pour la déconnexion. Déjà déconnecté ou erreur.");
        return "Déconnexion réussie (pas de token à révoquer côté serveur).";
    }

    try {
        const response = await api.post('/auth/logout', {}, { // Le body est souvent vide pour le logout
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        // Supprimer les cookies après déconnexion réussie du backend
        setCookie('token', '', { maxAge: 0, path: '/' });
        setCookie('refreshToken', '', { maxAge: 0, path: '/' });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la déconnexion :", error);
        throw error;
    }
};

// POST /api/auth/forgot-password
export const forgotPassword = async (email: string): Promise<string> => {
    const requestBody = { email }; // Le backend attend un paramètre de requête ou un corps JSON simple
    // Votre backend utilise @RequestParam String email, donc il attend un paramètre de requête ou form-urlencoded
    // Si c'est un body JSON, ce serait await api.post('/auth/forgot-password', { email });
    // Si c'est un param de requête, ce serait:
    const response = await api.post('/auth/forgot-password', null, { params: { email } });
    return response.data;
};

// POST /api/auth/reset-password
export const resetPassword = async (token: string, newPassword: string): Promise<string> => {
    // Votre backend utilise @RequestParam String token, @RequestParam String newPassword
    const response = await api.post('/auth/reset-password', null, {
        params: {
            token,
            newPassword,
        },
    });
    return response.data;
};

// --- Gestion des Salles de Classe ---
// (Vos fonctions existantes pour les salles de classe)
export interface SalleDeClasse {
    id: number;
    nom: string;
    statut: string;
}

export const getSalleDeClasse = async (): Promise<SalleDeClasse[]> => {
    const response = await apiClass.get('/classrooms');
    console.log("Résultat API salles :", response.data);
    return response.data;
};

export const postSalleDeClasse = async ({ nom, statut }: { nom: string; statut: string }): Promise<SalleDeClasse> => {
    const response = await apiClass.post('/classrooms', { nom, statut });
    console.log("Résultat API post salle :", response.data);
    return response.data;
};

export const deleteSalleDeClasse = async (id: number): Promise<void> => {
    const response = await apiClass.delete(`/classrooms/${id}`);
    console.log("Résultat API delete salle :", response.data);
};


// --- Gestion des Plannings Statiques ---
// (Vos fonctions existantes pour les plannings statiques)
export interface StatiquePlanningRequest {
    date: string;
    heureDebut: string;
    heureFin: string;
    coursPrevu: string;
    proprietaireFiliere: string;
    proprietaireNiveau: string;
    salleReserver: number;
    jours: string;
    adminId: number;
}
export interface StatiquePlanningResponse extends StatiquePlanningRequest {
    id: number;
}

export const createStatiquePlanning = async (planningData: StatiquePlanningRequest): Promise<StatiquePlanningResponse> => {
    const token = getCookie('token');
    if (!token) throw new Error("Jeton d'authentification manquant.");

    const response = await apiPlanning.post('/statiqueplannings', planningData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getAllStatiquePlannings = async (): Promise<StatiquePlanningResponse[]> => {
    const token = getCookie('token');
    if (!token) throw new Error("Jeton d'authentification manquant.");

    const response = await apiPlanning.get('/statiqueplannings', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getStatiquePlanningById = async (id: number): Promise<StatiquePlanningResponse> => {
    const token = getCookie('token');
    if (!token) throw new Error("Jeton d'authentification manquant.");

    const response = await apiPlanning.get(`/statiqueplannings/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const updateStatiquePlanning = async (id: number, planningData: StatiquePlanningRequest): Promise<StatiquePlanningResponse> => {
    const token = getCookie('token');
    if (!token) throw new Error("Jeton d'authentification manquant.");

    const response = await apiPlanning.put(`/statiqueplannings/${id}`, planningData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const deleteStatiquePlanning = async (id: number): Promise<void> => {
    const token = getCookie('token');
    if (!token) throw new Error("Jeton d'authentification manquant.");

    const response = await apiPlanning.delete(`/statiqueplannings/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    console.log("Réponse API pour la suppression du planning :", response.status);
};

export const getStatiquePlanningsByJours = async (jours: string): Promise<StatiquePlanningResponse[]> => {
    const token = getCookie('token');
    if (!token) throw new Error("Jeton d'authentification manquant.");

    const response = await apiPlanning.get(`/statiqueplannings/jours/${jours}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getStatiquePlanningsByFiliereAndNiveau = async (filiere: string, niveau: string): Promise<StatiquePlanningResponse[]> => {
    const token = getCookie('token');
    if (!token) throw new Error("Jeton d'authentification manquant.");

    const response = await apiPlanning.get(`/statiqueplannings/filiere/${filiere}/niveau/${niveau}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};