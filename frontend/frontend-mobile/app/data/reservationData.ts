export interface reservationRequestData {
    salleReserver:string,
    date:string,
    heureDebut:string, 
    heureFin:string,
    proprietaireFiliere:string,
    proprietaireNiveau:string,
    coursPrevu:string,
    delegueId:string,
}

export interface reservationData extends reservationRequestData {
    id:number,
}


export interface StatiquePlanningRequest {
    date: string;
    heureDebut: string;
    heureFin: string;
    coursPrevu: string;
    proprietaireFiliere: string;
    proprietaireNiveau: string;
    salleReserver: string;
    jours: string;
    adminId: number;
}
export interface StatiquePlanningResponse extends StatiquePlanningRequest {
    id: number;
}
 export function filterBySalle(salle: string, data: reservationData[]) {
    return data.filter(res => res.salleReserver === salle);
}
export function filterByDate(date: string, data: reservationData[]) {
    return data.filter(res => res.date === date);
}
export function filterByHeure(debut: string, fin: string, data: reservationData[]) {
    return data.filter(res =>
      res.heureDebut >= debut && res.heureFin <= fin
    );
  }
export function filterByFiliere(filiere: string, data: reservationData[]) {
    return data.filter(res => res.proprietaireFiliere === filiere);
}
export function filterByFiliereEtNiveau(filiere: string, niveau: string, data: reservationData[]) {
    return data.filter(res =>
      res.proprietaireFiliere === filiere && res.proprietaireNiveau === niveau
    );
}
export function filterByCours(cours: string, data: reservationData[]) {
    return data.filter(res => res.coursPrevu.toLowerCase().includes(cours.toLowerCase()));
  }
    export function filterByDelegueId(delegueId: string, data: reservationData[]) {
    return data.filter(res => res.delegueId === delegueId);
  }
  
export function filtreAvance(options: {
    date?: string;
    salle?: string;
    filiere?: string;
    niveau?: string;
  }, data: reservationData[]) {
    return data.filter(res =>
      (!options.date || res.date === options.date) &&
      (!options.salle || res.salleReserver === options.salle) &&
      (!options.filiere || res.proprietaireFiliere === options.filiere) &&
      (!options.niveau || res.proprietaireNiveau === options.niveau)
    );
  }

  export function isSalleOccupee(
    salle: string,
    date: string,
    heureDebut: string,
    heureFin: string,
    data: reservationData[]
  ): boolean {
    return data.some(res =>
      res.salleReserver === salle &&
      res.date === date &&
      (
        (heureDebut >= res.heureDebut && heureDebut < res.heureFin) ||
        (heureFin > res.heureDebut && heureFin <= res.heureFin) ||
        (heureDebut <= res.heureDebut && heureFin >= res.heureFin)
      )
    );
  }
  export function hasDelegueReservation(
    delegueId: string,
    date: string,
    cours: string,
    data: reservationData[]
  ): boolean {
    return data.some(res =>
      res.delegueId === delegueId &&
      res.date === date &&
      res.coursPrevu === cours
    );
  }
  export function reservationExiste(id: number, data: reservationData[]): boolean {
    return data.some(res => res.id === id);
  }
  export function isHeureValide(heureDebut: string, heureFin: string): boolean {
    return heureDebut < heureFin;
  }
  export function isChevauchementHoraire(
    date: string,
    cours: string,
    heureDebut: string,
    heureFin: string,
    data: reservationData[]
  ): boolean {
    return data.some(res =>
      res.date === date &&
      res.coursPrevu === cours &&
      (
        (heureDebut >= res.heureDebut && heureDebut < res.heureFin) ||
        (heureFin > res.heureDebut && heureFin <= res.heureFin) ||
        (heureDebut <= res.heureDebut && heureFin >= res.heureFin)
      )
    );
  }
    
//planningstatique methode
export function filterPlanningBySalle(salle: string, data: StatiquePlanningResponse[]) {
    return data.filter(plan => plan.salleReserver === salle);
  }
  
  export function filterPlanningByDate(date: string, data: StatiquePlanningResponse[]) {
    return data.filter(plan => plan.date === date);
  }
  
  export function filterPlanningByJour(jour: string, data: StatiquePlanningResponse[]) {
    return data.filter(plan => plan.jours.toLowerCase() === jour.toLowerCase());
  }
  
  export function filterPlanningByHeure(debut: string, fin: string, data: StatiquePlanningResponse[]) {
    return data.filter(plan =>
      plan.heureDebut >= debut && plan.heureFin <= fin
    );
  }
  
  export function filterPlanningByFiliereEtNiveau(
    filiere: string,
    niveau: string,
    data: StatiquePlanningResponse[]
  ) {
    return data.filter(plan =>
      plan.proprietaireFiliere === filiere &&
      plan.proprietaireNiveau === niveau
    );
  }
  
  export function filterPlanningByCours(cours: string, data: StatiquePlanningResponse[]) {
    return data.filter(plan =>
      plan.coursPrevu.toLowerCase().includes(cours.toLowerCase())
    );
  }
  
  export function filterPlanningByAdmin(adminId: number, data: StatiquePlanningResponse[]) {
    return data.filter(plan => plan.adminId === adminId);
  }
  
  export function filtreAvancePlanning(options: {
    date?: string;
    jour?: string;
    salle?: string;
    filiere?: string;
    niveau?: string;
  }, data: StatiquePlanningResponse[]) {
    return data.filter(plan =>
      (!options.date || plan.date === options.date) &&
      (!options.jour || plan.jours.toLowerCase() === options.jour.toLowerCase()) &&
      (!options.salle || plan.salleReserver === options.salle) &&
      (!options.filiere || plan.proprietaireFiliere === options.filiere) &&
      (!options.niveau || plan.proprietaireNiveau === options.niveau)
    );
  }

  export function isSalleStatiqueOccupee(
    salle:string,
    date: string,
    heureDebut: string,
    heureFin: string,
    data: StatiquePlanningResponse[]
  ): boolean {
    return data.some(plan =>
      plan.salleReserver === salle &&
      plan.date === date &&
      (
        (heureDebut >= plan.heureDebut && heureDebut < plan.heureFin) ||
        (heureFin > plan.heureDebut && heureFin <= plan.heureFin) ||
        (heureDebut <= plan.heureDebut && heureFin >= plan.heureFin)
      )
    );
  }
  
  export function planningStatiqueExiste(id: number, data: StatiquePlanningResponse[]): boolean {
    return data.some(plan => plan.id === id);
  }
  
  export function isHeureStatiqueValide(heureDebut: string, heureFin: string): boolean {
    return heureDebut < heureFin;
  }
  
  export function isChevauchementStatiqueHoraire(
    date: string,
    cours: string,
    heureDebut: string,
    heureFin: string,
    data: StatiquePlanningResponse[]
  ): boolean {
    return data.some(plan =>
      plan.date === date &&
      plan.coursPrevu === cours &&
      (
        (heureDebut >= plan.heureDebut && heureDebut < plan.heureFin) ||
        (heureFin > plan.heureDebut && heureFin <= plan.heureFin) ||
        (heureDebut <= plan.heureDebut && heureFin >= plan.heureFin)
      )
    );
  }
  