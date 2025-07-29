import axios from 'axios';

import {  reservationRequestData } from '../data/reservationData';

const API_NOTIFICATION_URL = "http://192.168.43.187:8080/api";

const apiNotification = axios.create({
  baseURL: API_NOTIFICATION_URL,
  headers: { 'Content-Type': 'application/json' },
});

export interface StatutNotification {
  utilisateurId: string;
  statut: 'Lue' | 'Non Lue';
}

export interface Notification {
  id: string;
  destinataireId: string[];
  titre: string;
  description: string;
  statutNotification: StatutNotification[];
  expediteurId?: string;
  createdAt: string;
}

export interface NotificationRequest {
  destinataireId: string[];
  titre: string;
  description: string;
  expediteurId?: string;
}

export interface StatutUpdateRequest {
  utilisateurId: string;
  statut: 'Lue' | 'Non Lue';
}

export interface NotificationQueryParams {
  destinataireId?: string;
  utilisateurId?: string;
  statut?: 'Lue' | 'Non Lue';
  expediteurId?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function CreateMessageNotificationForOtherDelegue(type: string, infos: reservationRequestData): string{
  return `${type}@Le délégué de la filière ${infos.proprietaireFiliere} du niveau ${infos.proprietaireNiveau}
souhaite réserver la salle : ${infos.salleReserver} le ${infos.date} de ${infos.heureDebut} à ${infos.heureFin}.
Validez-vous cette demande de réservation ?@${JSON.stringify(infos, null, 2)}`

}

export const createNotification = async (request: NotificationRequest): Promise<Notification> => {
  console.log("dans create notif");
  const response = await apiNotification.post('/notifications', request);
  return response.data;
};

export const getNotificationById = async (id: string): Promise<Notification> => {
  const response = await apiNotification.get(`/notifications/${id}`);
  return response.data;
};

export const getNotifications = async (params?: NotificationQueryParams): Promise<{ content: Notification[]; totalPages: number; totalElements: number; }> => {
  const response = await apiNotification.get('/notifications', { params });
  return response.data;
};

export const updateNotificationStatus = async (id: string, request: StatutUpdateRequest): Promise<Notification> => {
  const response = await apiNotification.patch(`/notifications/${id}/statut`, request);
  return response.data;
};

export const deleteNotification = async (id: string): Promise<void> => {
  await apiNotification.delete(`/notifications/${id}`);
};

export const getStatutForUser = (notif: Notification, userId: string): 'Lue' | 'Non Lue' | null => {
  const statut = notif.statutNotification.find(s => s.utilisateurId === userId);
  return statut ? statut.statut : null;
};
