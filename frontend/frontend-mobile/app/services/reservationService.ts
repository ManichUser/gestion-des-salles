
import axios from 'axios';
import { StatiquePlanningResponse, reservationData, reservationRequestData } from '../data/reservationData';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_PLANNING_URL = "http://192.168.43.187:8082/api"; 

const apiPlanning = axios.create({
    baseURL: API_PLANNING_URL,
  });



  export const getReservations = async () => {
  const response = await apiPlanning.get('/planning/reservations'); 
  return response.data;
};

export const getReservationsByDate=async(date:string)=>{
    const response=await apiPlanning.get(`/planning/reservation/${date}`)
    return response.data
}

export const createReservation = async (reservationData: reservationRequestData) => { 
    const response = await apiPlanning.post('/planning/reservations', reservationData);
    return response.data;
};

export const cancelReservation = async (reservationId: number) => {
    const response = await apiPlanning.delete(`/planning/reservations/${reservationId}`);
    return response.data;
};

export const getStatiquePlanningsByFiliereAndNiveau = async (filiere: string, niveau: string): Promise<StatiquePlanningResponse[]> => {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error("Jeton d'authentification manquant.");

    const response = await apiPlanning.get(`/statiqueplannings/filiere/${filiere}/niveau/${niveau}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
export const getAllStatiquePlannings = async (): Promise<StatiquePlanningResponse[]> => {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error("Jeton d'authentification manquant.");

    const response = await apiPlanning.get('/statiqueplannings', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getStatiquePlanningsByJours = async (jours: string): Promise<StatiquePlanningResponse[]> => {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error("Jeton d'authentification manquant.");

    const response = await apiPlanning.get(`/statiqueplannings/jours/${jours}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

