import { setCookie } from 'cookies-next';
import {api,  apiClass }from './api';

export const loginAdmin = async ({ email, password }: { email: string; password: string }) => {
  const response = await api.post('/auth/login', { email, password });

  // Sauvegarde du token dans un cookie (durée 1 jour)
  setCookie('token', response.data.token, {
    maxAge: 60 * 60 * 24,
    path: '/',
  });

  return response.data;
};

export const getSalleDeClasse = async () => {
  const response = await apiClass.get('/classrooms');
  console.log("Résultat API salles :", response.data); // TEST
  return response.data;
};
export const postSalleDeClasse=async({nom,statut}:{nom:string,statut:string})=>{
  const response =await apiClass.post('/classrooms',{nom,statut})
  console.log("Résultat API salles :", response.data); // TEST
  return response.data
}
export const deleteSalleDeClasse=async (id:number)=>{
  const  response =await apiClass.delete(`/classrooms/${id}`)
}
