"use client"

import { useEffect, useState } from "react"
import { getSalleDeClasse, createStatiquePlanning, StatiquePlanningRequest, SalleDeClasse } from "../api/apiServices";

export default function CreatePlanningForm({ visible }: { visible: boolean }) {
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // REMOVED: getCurrentDayOfWeek() n'est plus utilisé pour pré-remplir 'jours'

    const [formData, setFormData] = useState<StatiquePlanningRequest>({
        jours: "", // <-- NE PRÉ-REMPLIT PLUS le jour courant, l'utilisateur doit choisir
        date: getCurrentDate(), // <-- PRÉ-REMPLI avec la date courante
        heureDebut: "",
        heureFin: "",
        coursPrevu: "",
        proprietaireFiliere: "Informatique",
        proprietaireNiveau: "L1",
        salleReserver: 0, // Initialisé à 0 (aucun ID sélectionné)
        adminId: 1,       // <-- GÉRÉ AUTOMATIQUEMENT : ID d'admin par défaut.
                          // EN PRODUCTION: Cet ID devrait venir de la session de l'utilisateur authentifié (ex: depuis le token JWT).
    });

    const [salles, setSalles] = useState<SalleDeClasse[]>([]); // Toutes les salles de classe
    const [loadingSalles, setLoadingSalles] = useState(true); // État de chargement des salles
    const [errorSalles, setErrorSalles] = useState<string | null>(null); // Erreur lors du chargement des salles


    // Effet pour charger les salles au montage du composant
    useEffect(() => {
        const fetchSalles = async () => {
            setLoadingSalles(true);
            setErrorSalles(null);
            try {
                const data = await getSalleDeClasse(); // getSalleDeClasse est déjà typé dans apiServices
                setSalles(data);
                // Si des salles sont disponibles, définissez la première comme valeur par défaut
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, salleReserver: data[0].id })); // Met à jour salleReserver avec l'ID de la première salle
                }
            } catch (err) {
                console.error("Erreur lors de la récupération des salles :", err);
                setErrorSalles("Impossible de charger les salles. Veuillez réessayer.");
            } finally {
                setLoadingSalles(false);
            }
        };
        fetchSalles();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            // Convertit en nombre si le champ est 'salleReserver' (adminId n'est plus un input)
            [name]: (name === "salleReserver") ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation simple pour s'assurer qu'une salle a été sélectionnée (par ID)
        if (formData.salleReserver === 0) {
            alert("Veuillez sélectionner une salle.");
            return;
        }
        // Validation pour le champ 'jours' qui n'est plus pré-rempli
        if (!formData.jours) {
            alert("Veuillez sélectionner un jour de la semaine.");
            return;
        }
        // REMOVED: Validation pour l'ID Admin, car il n'est plus entré par l'utilisateur.

        try {
            const savedPlanning = await createStatiquePlanning(formData); // Envoie formData tel quel

            alert("Planning ajouté avec succès !");
            // Réinitialisation du formulaire après succès
            setFormData({
                jours: "", // <-- Réinitialise à vide pour que l'utilisateur choisisse
                date: getCurrentDate(), // <-- Réinitialise à la date courante non modifiable
                heureDebut: "",
                heureFin: "",
                coursPrevu: "",
                proprietaireFiliere: "Informatique",
                proprietaireNiveau: "L1",
                salleReserver: salles.length > 0 ? salles[0].id : 0, // Réinitialise avec l'ID de la 1ère salle ou 0
                adminId: 1, // <-- Réinitialise l'adminId à sa valeur par défaut automatique
            });
        } catch (error: any) {
            console.error("Erreur de soumission du planning:", error);
            alert(`Erreur lors de l'ajout du planning: ${error.message || "Une erreur inattendue est survenue."}`);
        }
    };

    return (
        <div className={`
            transition-all duration-500 ease-in-out transform
            ${visible ? 'max-h-screen opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4 overflow-hidden'}
        `}>
            <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800 dark:text-white mt-4">
                <h2 className="text-2xl font-bold text-[#14467a] dark:text-white mb-4">Ajouter un nouveau planning</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Remplissez les champs ci-dessous pour créer une nouvelle entrée de planning.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Jour de la semaine (select) */}
                    <div>
                        <label htmlFor="jours" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jour de la semaine</label>
                        <select
                            name="jours" // <-- Le nom du champ est "jours"
                            id="jours"
                            value={formData.jours}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                        >
                            <option value="">Sélectionnez un jour</option> {/* Option par défaut vide */}
                            <option value="Lundi">Lundi</option>
                            <option value="Mardi">Mardi</option>
                            <option value="Mercredi">Mercredi</option>
                            <option value="Jeudi">Jeudi</option>
                            <option value="Vendredi">Vendredi</option>
                            <option value="Samedi">Samedi</option>
                            <option value="Dimanche">Dimanche</option>
                        </select>
                    </div>

                    {/* Date (input date, pré-rempli et NON MODIFIABLE) */}
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date spécifique</label>
                        <input
                            type="date"
                            name="date"
                            id="date"
                            value={formData.date}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-not-allowed"
                            readOnly 
                            required
                        />
                    </div>

                    {/* Horaire */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label htmlFor="heureDebut" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Heure de début</label>
                            <input
                                type="time"
                                name="heureDebut"
                                id="heureDebut"
                                value={formData.heureDebut}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="heureFin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Heure de fin</label>
                            <input
                                type="time"
                                name="heureFin"
                                id="heureFin"
                                value={formData.heureFin}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                required
                            />
                        </div>
                    </div>

                    {/* Cours */}
                    <div>
                        <label htmlFor="coursPrevu" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom du Cours</label>
                        <input
                            type="text"
                            name="coursPrevu"
                            id="coursPrevu"
                            value={formData.coursPrevu}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Ex: Introduction à l'Informatique"
                            required
                        />
                    </div>

                    {/* Sélecteur de Salle (envoie l'ID) */}
                    <div>
                        <label htmlFor="salleReserver" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom de la Salle</label>
                        <select
                            name="salleReserver"
                            id="salleReserver"
                            value={formData.salleReserver}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                            disabled={loadingSalles}
                        >
                            {loadingSalles && <option value="">Chargement des salles...</option>}
                            {errorSalles && <option value="">{errorSalles}</option>}
                            {!loadingSalles && salles.length === 0 && <option value="">Aucune salle disponible</option>}
                            {/* Option par défaut pour forcer la sélection si aucune salle n'est pré-sélectionnée */}
                            {!loadingSalles && salles.length > 0 && formData.salleReserver === 0 && (
                                <option value="" disabled>Sélectionnez une salle</option>
                            )}
                            {salles.map((salle) => (
                                <option key={salle.id} value={salle.id}>
                                    {salle.nom}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Filière */}
                    <div>
                        <label htmlFor="proprietaireFiliere" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filière</label>
                        <select
                            name="proprietaireFiliere"
                            id="proprietaireFiliere"
                            value={formData.proprietaireFiliere}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                        >
                            <option value="Informatique">Informatique</option>
                            <option value="Mathematique">Mathématique</option>
                            <option value="Physique">Physique</option>
                            <option value="Chimie">Chimie</option>
                            <option value="Biochimie">Biochimie</option>
                            <option value="Biologie Animale">Biologie Animale</option>
                            <option value="Biologie Vegetale">Biologie Végétale</option>
                            <option value="Science de la terre">Science de la Terre</option>
                        </select>
                    </div>

                    {/* Niveau */}
                    <div>
                        <label htmlFor="proprietaireNiveau" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Niveau</label>
                        <select
                            name="proprietaireNiveau"
                            id="proprietaireNiveau"
                            value={formData.proprietaireNiveau}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                        >
                            <option value="L1">L1</option>
                            <option value="L2">L2</option>
                            <option value="L3">L3</option>
                            <option value="M1">M1</option>
                            <option value="M2">M2</option>
                            <option value="D1">D1</option>
                            <option value="D2">D2</option>
                            <option value="D3">D3</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="mt-6 w-full p-3 bg-[#14467a] text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        Enregistrer le planning
                    </button>
                    <button
                        type="reset"
                        onClick={() => setFormData({
                            jours: "", // Réinitialise à vide
                            date: getCurrentDate(), // Réinitialise à la date courante non modifiable
                            heureDebut: "",
                            heureFin: "",
                            coursPrevu: "",
                            proprietaireFiliere: "Informatique",
                            proprietaireNiveau: "L1",
                            salleReserver: salles.length > 0 ? salles[0].id : 0, // Réinitialise à l'ID de la première salle ou 0
                            adminId: 1 // Réinitialise l'adminId à sa valeur par défaut
                        })}
                        className="mt-2 w-full p-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-colors duration-200"
                    >
                        Annuler
                    </button>
                </form>
            </div>
        </div>
    );
}