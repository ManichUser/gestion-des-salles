"use client";

import { useState, useEffect, useCallback } from "react"; // Importez useCallback
import CreatePlanningForm from "../components/CreatePlanningForm";
import Filter from "../components/Filter";
import PlanningCard from "../components/planningCard";
import { getAllStatiquePlannings, StatiquePlanningResponse } from "../api/apiServices";

export default function PlanningPage() {
    const [visible, setVisible] = useState(false);
    const [openFilter, setOpenFilter] = useState(false);
    const [plannings, setPlannings] = useState<StatiquePlanningResponse[]>([]);
    const [loadingPlannings, setLoadingPlannings] = useState(true);
    const [errorPlannings, setErrorPlannings] = useState<string | null>(null);

    // Utilisez useCallback pour memoizer la fonction de récupération des plannings
    const fetchPlannings = useCallback(async () => {
        setLoadingPlannings(true);
        setErrorPlannings(null);
        try {
            const data = await getAllStatiquePlannings();
            setPlannings(data);
        } catch (err: any) {
            console.error("Erreur lors de la récupération des plannings :", err);
            setErrorPlannings(`Impossible de charger les plannings: ${err.message || "Une erreur inconnue est survenue."}`);
        } finally {
            setLoadingPlannings(false);
        }
    }, []); // La dépendance vide assure que la fonction n'est créée qu'une fois

    // Effet pour charger les plannings au montage initial
    useEffect(() => {
        fetchPlannings();
    }, [fetchPlannings]); // Dépend de fetchPlannings (qui est memoizée)

    // Effet pour recharger les plannings si le formulaire de création se ferme
    // (cela simule un rechargement après ajout)
    useEffect(() => {
        if (!visible) {
            fetchPlannings();
        }
    }, [visible, fetchPlannings]);

    // Fonction de rappel pour gérer la suppression réussie depuis PlanningCard
    const handlePlanningDeleteSuccess = useCallback((deletedId: number) => {
        // Option 1: Recharger tous les plannings (simple mais moins performant pour de grandes listes)
        fetchPlannings();

        // Option 2 (plus performante): Mettre à jour l'état local en filtrant l'élément supprimé
        // setPlannings(prevPlannings => prevPlannings.filter(p => p.id !== deletedId));
    }, [fetchPlannings]);


    return (
        <div className="min-h-screen pt-12 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <h1 className="text-4xl font-extrabold text-center mt-8 mb-8 text-[#14467a] dark:text-white">
                    Occupation des salles
                </h1>

                <div className="flex flex-col sm:flex-row w-full justify-center sm:justify-end gap-4 mb-8">
                    <button
                        className="
                            flex-1 sm:flex-none p-4 rounded-xl shadow-lg
                            bg-[#14467a] text-white font-semibold
                            hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300
                            transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95
                        "
                        onClick={() => {
                            setVisible(!visible);
                            setOpenFilter(false);
                        }}
                    >
                        {!visible ? "Ajouter un nouveau planning" : "Fermer le formulaire"}
                    </button>

                    <button
                        className="
                            flex-1 sm:flex-none p-4 rounded-xl shadow-lg
                            bg-blue-500 text-white font-semibold
                            hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300
                            transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95
                        "
                        onClick={() => {
                            setOpenFilter(!openFilter);
                            setVisible(false);
                        }}
                    >
                        {!openFilter ? "Filtrer le tableau" : "Fermer le filtre"}
                    </button>
                </div>

                {visible && (
                    <div className="mb-6">
                        <CreatePlanningForm visible={visible} />
                    </div>
                )}

                {openFilter && (
                    <div className="mb-6">
                        <Filter visible={openFilter} />
                    </div>
                )}

                <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                    <div className="
                        hidden sm:flex w-full font-bold justify-between p-4
                        bg-[#14467a] text-white dark:bg-gray-700 dark:text-white
                        border-b border-gray-700 dark:border-gray-600
                    ">
                        <label className="min-w-[100px] text-left">Jour</label>
                        <label className="min-w-[100px] text-left">Date</label>
                        <label className="min-w-[160px] text-center">Horaire</label>
                        <label className="flex-1 text-center">Salle</label>
                        <label className="flex-1 text-left">Filière</label>
                        <label className="flex-1 text-left">Niveau</label>
                        <label className="flex-1 text-left">Cours</label>
                        <label className="min-w-[120px] text-right">Action</label>
                    </div>

                    {loadingPlannings && (
                        <div className="p-4 text-center text-gray-600 dark:text-gray-400">Chargement des plannings...</div>
                    )}
                    {errorPlannings && (
                        <div className="p-4 text-center text-red-500 dark:text-red-400">Erreur: {errorPlannings}</div>
                    )}
                    {!loadingPlannings && plannings.length === 0 && !errorPlannings && (
                        <div className="p-4 text-center text-gray-600 dark:text-gray-400">Aucun planning trouvé.</div>
                    )}

                    {!loadingPlannings && plannings.length > 0 && (
                        plannings.map((p) => (
                            <PlanningCard
                                key={p.id}
                                planning={p}
                                onDeleteSuccess={handlePlanningDeleteSuccess} // Passe la fonction de rappel
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}