// src/main/java/com/notificationservice/repository/NotificationRepository.java
package com.notification.notification_service.repository;

import com.notification.notification_service.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {

    // Méthode pour trouver les notifications où un utilisateur est destinataire
    List<Notification> findByDestinataireIdContaining(String destinataireId);

    // Méthode pour trouver les notifications envoyées par un expéditeur
    List<Notification> findByExpediteurId(String expediteurId);

    // Requête personnalisée pour trouver les notifications non lues pour un utilisateur spécifique
    @Query("{ 'statutNotification': { $elemMatch: { 'utilisateurId': ?0, 'statut': 'Non Lue' } } }")
    List<Notification> findUnreadNotificationsForUser(String utilisateurId);

    // Requête personnalisée pour trouver les notifications avec un statut spécifique pour un utilisateur
    @Query("{ 'statutNotification': { $elemMatch: { 'utilisateurId': ?0, 'statut': ?1 } } }")
    List<Notification> findNotificationsByUserAndStatus(String utilisateurId, String statut);
}