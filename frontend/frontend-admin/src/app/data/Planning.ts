import { SalleDeClasse } from "../api/apiServices";

export interface Planning {
    id: number; // Modifié pour correspondre au Long en Java, si vos IDs sont numériques
    date: string; // Correspond à LocalDate en Java (format "YYYY-MM-DD")
    heureDebut: string; // Correspond à LocalTime en Java (format "HH:MM" ou "HH:MM:SS")
    heureFin: string; // Correspond à LocalTime en Java (format "HH:MM" ou "HH:MM:SS")
    proprietaireFiliere: string; // Correspond à proprietaireFiliere
    proprietaireNiveau: string; // Correspond à proprietaireNiveau
    cours:string;
    salleId: number; // Correspond à Long salleId en Java
    adminId: number; // Correspond à Long adminId en Java
}

export type Status = "RESERVER" | "OCCUPEE" | "LIBRE";

export interface Salle {
    id: number; // Conserve string pour l'ID de Salle, comme dans vos données
    nom: string;
    Statut: Status;
}



export function getSalleIdByNom(salleName: string, salles: SalleDeClasse[]): number  {
    const salleTrouvee = salles.find(salle => salle.nom === salleName);
    return salleTrouvee ? salleTrouvee.id :0;
}