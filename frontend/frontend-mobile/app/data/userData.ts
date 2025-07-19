export interface user{
    id:number,
    lastname:string,
    firstname:string,
    username:string,
    email:string,
    niveau:string,
    filiere:string,
    roleName:string,
    status:string,
    enabeled:boolean

    
}
export const userExample : user ={
    id: 1,
    lastname: "Njiki",
    firstname: "James",
    username: "Jameski",
    email: "Jameski@gmail.com",
    niveau: "L3",
    filiere: "Informatique",
    roleName: "Delegue",
    status: "Actif",
    enabeled: false
}
export const initialData = [
    { id: '1', niveau: 'L3', filiere: 'Chimie', heureDeb: '09:00',heureFin:'10:00', status: 'RESERVEE' },
    { id: '2', niveau: 'L3', filiere: 'Mathematique',  heureDeb: '10:00',heureFin:'14:00', status: 'OCCUPEE' },
    { id: '3', niveau: 'L3', filiere: 'Mathematique',  heureDeb: '14:00',heureFin:'15:00', status: 'Libre  ' },
    { id: '5', niveau: 'M1', filiere: 'Informatique', heureDeb: '09:00',heureFin:'10:00', status: 'RESERVEE' },
    { id: '6', niveau: 'L3', filiere: 'Informatique',  heureDeb: '10:00',heureFin:'14:00', status: 'OCCUPEE' },
    { id: '7', niveau: 'L2', filiere: 'Chimie',  heureDeb: '14:00',heureFin:'15:00', status: 'Libre  ' },
    { id: '4', niveau: 'L3', filiere: 'Chimie',  heureDeb: '16:00',heureFin:'18:00', status: 'En attente' },
    
];