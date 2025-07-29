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
export function filterByFiliereEtNiveau(filiere: string|undefined, niveau: string|undefined, data: reservationData[]) {

    return data.filter(res =>
      res.proprietaireFiliere.toLowerCase() === filiere?.toLowerCase() &&
      res.proprietaireNiveau.toLowerCase() === niveau?.toLowerCase()
    );
}
export function filterByCours(cours: string, data: reservationData[]) {
    return data.filter(res => res.coursPrevu.toLowerCase().includes(cours.toLowerCase()));
  }
    export function filterByDelegueId(delegueId: string|undefined, data: reservationData[]) {
    return data.filter(res => res.delegueId.toString() === delegueId);
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

  export function isSalleReserver(
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
  
    heureDebut: string,
    heureFin: string,
    data: reservationData[]
  ): boolean {
    return data.some(res =>
      res.date === date &&
      
      (
        (heureDebut >= res.heureDebut && heureDebut < res.heureFin) ||
        (heureFin > res.heureDebut && heureFin <= res.heureFin) ||
        (heureDebut <= res.heureDebut && heureFin >= res.heureFin)
      )
    );
  }
    
//planningstatique methode
export function filterPlanningBySalle(salleId: string, data: StatiquePlanningResponse[]) {
    return data.filter(plan => plan.salleReserver.toString() === salleId);
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
  
  export function findProprietaireNiveaProprietairefiliereForHorraire( 
    date: string,
    heureDebut: string,
    heureFin: string, 
    data: StatiquePlanningResponse[]):{filiere:string|undefined,niveau:string|undefined} {

    const jour=getDayOfWeek(date)
    const elt=data.find(plan=>plan.jours===jour && plan.heureDebut==heureDebut&&plan.heureFin===heureFin)
    return {filiere:elt?.proprietaireFiliere,niveau:elt?.proprietaireNiveau}
  
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

  export function isEcheanceStatiqueLibre(
    salle:string,
    date: string,
    heureDebut: string,
    heureFin: string,
    data: StatiquePlanningResponse[]
  ): boolean {
    const jour =getDayOfWeek(date)
    return data.every(plan =>
      plan.salleReserver === salle &&
      plan.jours === jour &&
      (
        (heureDebut != plan.heureDebut ) &&
        (heureFin !=plan.heureFin ) 
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
    heureDebut: string,
    heureFin: string,
    data: StatiquePlanningResponse[]
  ): boolean {
    const jour=getDayOfWeek(date)
    return data.some(plan =>
      plan.jours === jour &&

      (
        (heureDebut >= plan.heureDebut && heureDebut < plan.heureFin) ||
        (heureFin > plan.heureDebut && heureFin <= plan.heureFin) ||
        (heureDebut <= plan.heureDebut && heureFin >= plan.heureFin)
      )
    );
  }
  export const days=['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']
  export function getDayOfWeek(isoDate: string | number | Date){
    const date=new Date(isoDate);
    return days[date.getDay()]
  }

  export function isDefaultOwner(
    date: string,
    heureDebut: string,
    heureFin: string,
    filiere:string,
    niveau:string,
    data:StatiquePlanningResponse[]
  ):boolean{
    const jour=getDayOfWeek(date)
    return data.some(plan=>
      plan.jours===jour&&
      plan.heureDebut<=heureDebut &&
      plan.heureFin >=heureFin &&
      plan.proprietaireFiliere===filiere &&
      plan.proprietaireNiveau===niveau
    )
  }