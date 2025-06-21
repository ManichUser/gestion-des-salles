export interface Planning {
    id: number; // Modifié pour correspondre au Long en Java, si vos IDs sont numériques
    date: string; // Correspond à LocalDate en Java (format "YYYY-MM-DD")
    heureDebut: string; // Correspond à LocalTime en Java (format "HH:MM" ou "HH:MM:SS")
    heureFin: string; // Correspond à LocalTime en Java (format "HH:MM" ou "HH:MM:SS")
    proprietaireFiliere: string; // Correspond à proprietaireFiliere
    proprietaireNiveau: string; // Correspond à proprietaireNiveau
    salleId: number; // Correspond à Long salleId en Java
    adminId: number; // Correspond à Long adminId en Java
}

export type Status = "RESERVER" | "OCCUPEE" | "LIBRE";

export interface Salle {
    id: number; // Conserve string pour l'ID de Salle, comme dans vos données
    nom: string;
    Statut: Status;
}

export const PlanningData: Planning[] = [
    { id: 1, date: "2025-06-10", heureDebut: "09:00", heureFin: "10:00", proprietaireFiliere: "Informatique", proprietaireNiveau: "L1", salleId: 1, adminId: 1 },
    { id: 2, date: "2025-06-10", heureDebut: "10:00", heureFin: "11:00", proprietaireFiliere: "Mathematique", proprietaireNiveau: "M1", salleId: 2, adminId: 1 },
    { id: 3, date: "2025-06-11", heureDebut: "14:00", heureFin: "15:00", proprietaireFiliere: "Informatique", proprietaireNiveau: "L3", salleId: 3, adminId: 2 },
    { id: 4, date: "2025-06-12", heureDebut: "11:00", heureFin: "12:00", proprietaireFiliere: "Chimie", proprietaireNiveau: "L2", salleId: 4, adminId: 2 },
    { id: 5, date: "2025-06-12", heureDebut: "13:00", heureFin: "14:00", proprietaireFiliere: "Biochimie", proprietaireNiveau: "L1", salleId: 5, adminId: 3 },
    { id: 6, date: "2025-06-13", heureDebut: "08:00", heureFin: "09:00", proprietaireFiliere: "Biologie Vegetale", proprietaireNiveau: "L2", salleId: 7, adminId: 3 },
];

export function getSalleNomById(salleId: number, salles: Salle[]): string {
    const salleTrouvee = salles.find(salle => salle.id === salleId);
    return salleTrouvee ? salleTrouvee.nom : "Nom de salle inconnu";
}