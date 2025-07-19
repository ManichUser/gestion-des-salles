"use client";

import { useState, useEffect, useCallback } from "react";
import { getAllUsers, UserResponse } from "../api/apiServices"; // Importez la fonction et l'interface
import UserCard from "../components/UserCard"; // Importez le composant UserCard

export default function Utilisateurs() {
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fonction pour récupérer les utilisateurs
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (err: any) {
            console.error("Erreur lors de la récupération des utilisateurs :", err);
            setError(err.message || "Impossible de charger les utilisateurs.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Charger les utilisateurs au montage du composant
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Fonction de rappel pour recharger la liste après une mise à jour d'un utilisateur
    const handleUserUpdated = useCallback(() => {
        fetchUsers();
    }, [fetchUsers]);

    return (
        <div className="min-h-screen pt-24 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <h1 className="text-4xl font-extrabold text-center mt-8 mb-8 text-[#14467a] dark:text-white">
                    Gestion des Utilisateurs
                </h1>

                <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                    <div className="
                        hidden sm:flex w-full font-bold justify-between p-4
                        bg-[#14467a] text-white dark:bg-gray-700 dark:text-white
                        border-b border-gray-700 dark:border-gray-600
                    ">
                        <label className="flex-1 min-w-[200px] text-left">Nom / Email</label>
                        <label className="min-w-[150px] text-left">Rôle</label>
                        <label className="min-w-[150px] text-left">Statut</label>
                    </div>

                    {loading && (
                        <div className="p-4 text-center text-gray-600 dark:text-gray-400">Chargement des utilisateurs...</div>
                    )}
                    {error && (
                        <div className="p-4 text-center text-red-500 dark:text-red-400">Erreur: {error}</div>
                    )}
                    {!loading && users.length === 0 && !error && (
                        <div className="p-4 text-center text-gray-600 dark:text-gray-400">Aucun utilisateur trouvé.</div>
                    )}

                    {!loading && users.length > 0 && (
                        users.map((user) => (
                            <UserCard
                                key={user.id}
                                user={user}
                                onUserUpdated={handleUserUpdated} // Passe le callback
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}