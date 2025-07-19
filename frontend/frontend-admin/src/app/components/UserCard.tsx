"use client";

import { useState } from "react";
// Assurez-vous que apiServices.ts contient bien les fonctions updateUserRole et updateUserStatus
import { updateUserRole, updateUserStatus, RoleUpdateRequest, StatusUpdateRequest } from "../api/apiServices";

// Interface pour le rôle, car il est un objet dans votre réponse API
export interface Role {
    id: number;
    name: string;
}

// Interface pour les données utilisateur retournées par les endpoints GET /users
// Cette interface reflète la structure exacte du JSON que vous avez fourni
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

interface UserCardProps {
    user: UserResponse;
    onUserUpdated: () => void; // Callback pour notifier le parent d'une mise à jour
}

export default function UserCard({ user, onUserUpdated }: UserCardProps) {
    // Initialiser newRole avec user.role.name car user.role est un objet
    const [isEditingRole, setIsEditingRole] = useState(false);
    const [newRole, setNewRole] = useState(user.role.name); // MODIFICATION CLÉ ICI
    const isAdminRole = user.role.name==='ADMIN'
    const [isEditingStatus, setIsEditingStatus] = useState(false);
    const [newStatus, setNewStatus] = useState(user.status); // Correct car user.status est une chaîne
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpdateRole = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // newRole est déjà la chaîne ("ADMIN", "USER", etc.)
            const request: RoleUpdateRequest = { role: newRole }; 
            await updateUserRole(user.id, request);
            alert(`Rôle de ${user.email} mis à jour en : ${newRole}`);
            setIsEditingRole(false);
            onUserUpdated(); // Notifie le parent de la mise à jour
        } catch (err: any) {
            console.error("Erreur lors de la mise à jour du rôle :", err);
            // Amélioration de la gestion des erreurs pour afficher un message plus précis
            setError(err.response?.data?.message || err.message || "Erreur de mise à jour du rôle.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const request: StatusUpdateRequest = { status: newStatus };
            await updateUserStatus(user.id, request);
            alert(`Statut de ${user.email} mis à jour en : ${newStatus}`);
            setIsEditingStatus(false);
            onUserUpdated(); // Notifie le parent de la mise à jour
        } catch (err: any) {
            console.error("Erreur lors de la mise à jour du statut :", err);
            // Amélioration de la gestion des erreurs
            setError(err.response?.data?.message || err.message || "Erreur de mise à jour du statut.");
        } finally {
            setIsLoading(false);
        }
    };

    // Options de rôle et de statut (à adapter selon les valeurs de votre backend)
    // Assurez-vous que ces listes correspondent aux "name" possibles des rôles/statuts
    const roleOptions = ["DELEGUE", "USER"]; 
    const statusOptions = ["ACTIF", "PASSIF"]; 

    return (
        <div className="
            flex flex-col sm:flex-row justify-between items-start sm:items-center
            p-4 border-b border-gray-200 dark:border-gray-700
            hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200
            last:border-b-0
        ">
            {/* Informations de l'utilisateur */}
            <div className="flex-1 min-w-[200px] mb-2 sm:mb-0">
                {/* user.firstname et user.lastname peuvent être null, React gère cela en n'affichant rien */}
                <p className="font-semibold text-gray-900 dark:text-white">
                    {user.firstname} {user.lastname}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
            </div>

            {/* Rôle */}
            <div className="min-w-[150px] mb-2 sm:mb-0">
                <span className="font-bold sm:hidden">Rôle: </span>
                {isEditingRole ? (
                    <div className="flex items-center gap-2">
                        <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            className="p-1 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                            disabled={isLoading}
                        >
                            {roleOptions.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleUpdateRole}
                            className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                            disabled={isLoading}
                        >
                            {isLoading ? "..." : "Sauver"}
                        </button>
                        <button
                            onClick={() => {
                                setIsEditingRole(false);
                                // Réinitialiser newRole avec le nom du rôle actuel de l'utilisateur
                                setNewRole(user.role.name); // MODIFICATION CLÉ ICI
                            }}
                            className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
                            disabled={isLoading}
                        >
                            Annuler
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        {/* Affiche le nom du rôle */}
                        <span className="text-gray-700 dark:text-gray-300">{user.role.name}</span> {/* MODIFICATION CLÉ ICI */}
                       { !isAdminRole &&( <button
                            onClick={() => setIsEditingRole(true)}
                            className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                        >
                            Modifier
                        </button>)}
                    </div>
                )}
            </div>

            {/* Statut */}
            <div className="min-w-[150px] mb-2 sm:mb-0">
                <span className="font-bold sm:hidden">Statut: </span>
                {isEditingStatus ? (
                    <div className="flex items-center gap-2">
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="p-1 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                            disabled={isLoading}
                        >
                            {statusOptions.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleUpdateStatus}
                            className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                            disabled={isLoading}
                        >
                            {isLoading ? "..." : "Sauver"}
                        </button>
                        <button
                            onClick={() => {
                                setIsEditingStatus(false);
                                setNewStatus(user.status);
                            }}
                            className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
                            disabled={isLoading}
                        >
                            Annuler
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className="text-gray-700 dark:text-gray-300">{user.status}</span>
                        {!isAdminRole &&( <button
                            onClick={() => setIsEditingStatus(true)}
                            className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                        >
                            Modifier
                        </button>)}
                    </div>
                )}
            </div>

            {/* Message d'erreur */}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}