"use client"
import { useState,useEffect } from "react";
import { Planning, Salle,getSalleNomById } from "../data/Planning";
import { getSalleDeClasse, } from "../api/apiServices";

interface PlanningCardProps {
    planning: Planning;
    // Si SalleData n'est pas importée directement, vous pouvez la passer via props
    salles?: Salle[];
}


export default function PlanningCard({ planning /*, salles*/ }: PlanningCardProps) {

    const [SalleData,setSalleData]=useState<any[]>([])
    const [loading, setLoading] = useState(true);
    useEffect(() => {
    const fetchSalles = async () => {
        try {
            const data = await getSalleDeClasse();
        
            setSalleData(data);
            } catch (err) {
                console.error("Erreur lors de la récupération des salles :", err);
                alert("erreur")
            } finally {
                setLoading(false);
            }
        };

        fetchSalles();
    }, []);
    // Fonction utilitaire pour trouver le nom de la salle par son ID
    const getRoomLabel = (salleId: number): string => {
        const salle = SalleData.find(s => s.id === salleId.toString()); // Convertir salleId en string pour la comparaison si Salle.id est string
        return salle ? salle.nom : `Salle ID: ${salleId}`; // Retourne le label ou l'ID si non trouvé
    };

    return (
        <div className="
            flex flex-col sm:flex-row justify-between items-start sm:items-center
            p-4 border-b border-gray-200 dark:border-gray-700
            hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200
            last:border-b-0 // Supprime la bordure inférieure de la dernière carte
        ">
            {/* Chaque span devient un bloc sur mobile pour une meilleure lisibilité */}
            <span className="min-w-[80px] text-left font-semibold sm:font-normal text-gray-800 dark:text-gray-200 mb-1 sm:mb-0">
                <span className="sm:hidden font-bold">Date: </span>{planning.date} 
            </span>
            <span className="min-w-[120px] text-left text-gray-700 dark:text-gray-300 mb-1 lg:ml-10 sm:mb-0">
                <span className="sm:hidden font-bold">De: </span>{planning.heureDebut} 
            </span>
            <span className="min-w-[120px] text-left text-gray-700 dark:text-gray-300 mb-1 sm:mb-0">
                <span className="sm:hidden font-bold">À: </span>{planning.heureFin} 
            </span>

            <span className="flex-1 text-left text-gray-700 dark:text-gray-300 mb-1 sm:mb-0">
                <span className="sm:hidden font-bold">Salle: </span>{getSalleNomById(planning.salleId,SalleData)} 
            </span>
            <span className="flex-1 text-left text-gray-700 dark:text-gray-300 mb-1 sm:mb-0">
                <span className="sm:hidden font-bold">Filière: </span>{planning.proprietaireFiliere}
            </span>
            <span className="flex-1 text-left lg:pl-4 text-gray-700 dark:text-gray-300 mb-1 sm:mb-0">
                <span className="sm:hidden font-bold">Niveau: </span>{planning.proprietaireNiveau}
            </span>

            {/* Conteneur des actions, devient flex-row sur mobile et s'aligne à droite sur desktop */}
            <div className="min-w-[120px] flex justify-end space-x-2 mt-2 sm:mt-0 w-full sm:w-auto">
                <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm">
                    Éditer
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm">
                    Supprimer
                </button>
            </div>
        </div>
    );
};