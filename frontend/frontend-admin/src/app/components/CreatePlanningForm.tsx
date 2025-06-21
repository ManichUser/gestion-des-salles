"use client"

import { useState } from "react"

// Supposons que cette interface est définie quelque part,
// ou que vous l'importez si elle vient d'un fichier de types partagé.
// Elle reflète la structure attendue par PlanningRequest en Java.
interface PlanningRequest {
    date: string; // LocalDate
    heureDebut: string; // LocalTime
    heureFin: string; // LocalTime
    cours: string;
    proprietaireFiliere: string;
    proprietaireNiveau: string; // Ou number si votre backend le gère comme un Long pur, mais string est plus flexible pour "L1", "M2" etc.
    salleId: number; // Long
}

export default function CreatePlanningForm({ visible }: { visible: boolean }) {
    // Initialiser formData avec les noms de champs qui correspondent à PlanningRequest en Java
    const [formData, setFormData] = useState<PlanningRequest>({
        date: "",
        heureDebut: "",
        heureFin: "",
        cours: "", // Nouveau champ
        proprietaireFiliere: "Informatique", // Valeur par défaut
        proprietaireNiveau: "L1", // Valeur par défaut
        salleId: 0, // Valeur par défaut (à remplacer par un ID de salle réel)
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        // Gérer spécifiquement les types numériques si nécessaire
        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? parseFloat(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Empêche le rechargement de la page par défaut

        // Ici, vous auriez besoin d'obtenir le token d'authentification.
        // Pour cet exemple, je vais utiliser un token factice.
        // En production, il viendrait de votre système d'authentification (ex: Context API, Redux, localStorage).
        const authToken = localStorage.getItem("authToken") || "Bearer votre_token_admin_ici"; // REMPLACER PAR LE VRAI TOKEN

        try {
            const response = await fetch("/api/admin/planning", { // Assurez-vous que le chemin est correct
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": authToken,
                },
                body: JSON.stringify(formData), // Convertir l'objet formData en JSON
            });

            if (response.ok) {
                alert("Planning ajouté avec succès !");
                // Réinitialiser le formulaire après succès
                setFormData({
                    date: "",
                    heureDebut: "",
                    heureFin: "",
                    cours: "",
                    proprietaireFiliere: "Informatique",
                    proprietaireNiveau: "L1",
                    salleId: 0,
                });
            } else {
                const errorData = await response.json();
                alert(`Erreur lors de l'ajout du planning: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error("Erreur de soumission du planning:", error);
            alert("Une erreur inattendue est survenue.");
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
                    {/* Date */}
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                        <input
                            type="date"
                            name="date" // Nom du champ correspondant à Java
                            id="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                        />
                    </div>

                    {/* Horaire */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label htmlFor="heureDebut" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Heure de début</label>
                            <input
                                type="time"
                                name="heureDebut" // Nom du champ correspondant à Java
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
                                name="heureFin" // Nom du champ correspondant à Java
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
                        <label htmlFor="cours" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom du Cours</label>
                        <input
                            type="text"
                            name="cours" // Nouveau champ correspondant à Java
                            id="cours"
                            value={formData.cours}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Ex: Introduction à l'Informatique"
                            required
                        />
                    </div>

                    {/* Salle ID */}
                    <div>
                        <label htmlFor="salleId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ID de la Salle</label>
                        <input
                            type="number" // Type numérique pour l'ID
                            name="salleId" // Nom du champ correspondant à Java
                            id="salleId"
                            value={formData.salleId === 0 ? '' : formData.salleId} // Afficher vide si 0
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Ex: 101"
                            min={1}
                            required
                        />
                    </div>

                    {/* Filière */}
                    <div>
                        <label htmlFor="proprietaireFiliere" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filière</label>
                        <select
                            name="proprietaireFiliere" // Nom du champ correspondant à Java
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
                            name="proprietaireNiveau" // Nom du champ correspondant à Java
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
                            <option value="D1">D1</option> {/* Exemple de niveaux de doctorat */}
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
                    {/* Un bouton "Annuler" peut être ajouté si nécessaire, pour réinitialiser le formulaire ou masquer la modale */}
                    {/* <button
                        type="reset"
                        onClick={() => setFormData({ date: "", heureDebut: "", heureFin: "", cours: "", proprietaireFiliere: "Informatique", proprietaireNiveau: "L1", salleId: 0 })}
                        className="mt-2 w-full p-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-colors duration-200"
                    >
                        Annuler
                    </button> */}
                </form>
            </div>
        </div>
    );
}