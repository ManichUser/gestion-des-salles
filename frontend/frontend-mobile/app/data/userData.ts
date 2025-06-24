export interface user{
    id:number,
    nom:string,
    prenom:string,
    username:string,
    email:string,
    niveau:string,
    filiere:string,
    password:string,
}
export const userExample : user ={
    id: 1,
    nom: "Njiki",
    prenom: "James",
    username: "Jameski",
    email: "Jameski@gmail.com",
    niveau: "L3",
    filiere: "Informatique",
    password: "Passe1234"
}