"use client";

import { useState, useEffect } from "react";
import { getSalleDeClasse, StatiquePlanningResponse, SalleDeClasse, deleteStatiquePlanning } from "../api/apiServices"; // Importez deleteStatiquePlanning

interface PlanningCardProps {
    planning: StatiquePlanningResponse;
    onDeleteSuccess: (deletedId: number) => void; // Nouvelle prop: fonction à appeler après une suppression réussie
}

export default function PlanningCard({ planning, onDeleteSuccess }: PlanningCardProps) {
    const [sallesData, setSallesData] = useState<SalleDeClasse[]>([]);
    const [loadingSalles, setLoadingSalles] = useState(true);
    const [errorSalles, setErrorSalles] = useState<string | null>(null);

    useEffect(() => {
        const fetchSalles = async () => {
            setLoadingSalles(true);
            setErrorSalles(null);
            try {
                const data = await getSalleDeClasse();
                setSallesData(data);
            } catch (err) {
                console.error("Erreur lors de la récupération des salles :", err);
                setErrorSalles("Impossible de charger les noms des salles. Veuillez recharger la page.");
            } finally {
                setLoadingSalles(false);
            }
        };

        fetchSalles();
    }, []);

    // Fonction utilitaire pour trouver le nom de la salle par son ID
    const getRoomLabel = (salleId: number): string => {
        const salle = sallesData.find(s => s.id === salleId);
        return salle ? salle.nom : `Salle ID: ${salleId}`;
    };

    // Nouvelle fonction pour gérer la suppression
    const handleDelete = async () => {
        if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ce planning pour le ${planning.jours} ${planning.date} de ${planning.heureDebut} à ${planning.heureFin} ?`)) {
            return; // L'utilisateur a annulé
        }

        try {
            await deleteStatiquePlanning(planning.id);
            alert("Planning supprimé avec succès !");
            onDeleteSuccess(planning.id); // Notifie le parent que la suppression a réussi
        } catch (err) {
            console.error("Erreur lors de la suppression du planning :", err);
            alert("Erreur lors de la suppression du planning. Veuillez réessayer.");
        }
    };

    return (
        <div className="
            flex flex-col sm:flex-row justify-between items-start sm:items-center
            p-4 border-b border-gray-200 dark:border-gray-700
            hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200
            last:border-b-0
        ">
            {/* Jour de la semaine */}
            <span className="min-w-[100px] text-left font-semibold sm:font-normal text-gray-800 dark:text-gray-200 mb-1 sm:mb-0">
                <span className="sm:hidden font-bold">Jour: </span>{planning.jours}
            </span>
            {/* Date */}
            <span className="min-w-[100px] text-left font-semibold sm:font-normal text-gray-800 dark:text-gray-200 mb-1 sm:mb-0">
                <span className="sm:hidden font-bold">Date de Création: </span>{planning.date}
            </span>
            {/* Horaire de début */}
            <span className="min-w-[80px] text-left text-gray-700 dark:text-gray-300 mb-1 lg:ml-10 sm:mb-0">
                <span className="sm:hidden font-bold">De: </span>{planning.heureDebut}
            </span>
            {/* Horaire de fin */}
            <span className="min-w-[80px] text-left text-gray-700 dark:text-gray-300 mb-1 sm:mb-0">
                <span className="sm:hidden font-bold">À: </span>{planning.heureFin}
            </span>

            {/* Salle : Conversion de salleReserver en nombre */}
            <span className="flex-1 text-left text-gray-700 dark:text-gray-300 mb-1 sm:mb-0">
                <span className="sm:hidden font-bold">Salle: </span>
                {loadingSalles ? (
                    "Chargement..."
                ) : errorSalles ? (
                    "Erreur salle"
                ) : (
                    getRoomLabel(Number(planning.salleReserver)) // Conversion en nombre ici
                )}
            </span>
            {/* Filière */}
            <span className="flex-1 text-left text-gray-700 dark:text-gray-300 mb-1 sm:mb-0">
                <span className="sm:hidden font-bold">Filière: </span>{planning.proprietaireFiliere}
            </span>
            {/* Niveau */}
            <span className="flex-1 text-left lg:pl-8 text-gray-700 dark:text-gray-300 mb-1 sm:mb-0">
                <span className="sm:hidden font-bold">Niveau: </span>{planning.proprietaireNiveau}
            </span>
            {/* Cours */}
            <span className="flex-1 text-left text-gray-700 dark:text-gray-300 mb-1 sm:mb-0">
                <span className="sm:hidden font-bold">Cours: </span>{planning.coursPrevu}
            </span>
            {/* Conteneur des actions */}
            <div className="min-w-[120px] flex justify-end space-x-2 mt-2 sm:mt-0 w-full sm:w-auto">
                <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm">
                    Éditer
                </button>
                <button
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm"
                    onClick={handleDelete} // Appelle la fonction de suppression
                >
                    Supprimer
                </button>
            </div>
        </div>
    );
}