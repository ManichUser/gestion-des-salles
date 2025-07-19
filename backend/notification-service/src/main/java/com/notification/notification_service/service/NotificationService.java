// src/main/java/com/notificationservice/service/NotificationService.java
package com.notification.notification_service.service;



import com.notification.notification_service.dto.NotificationRequest;
import com.notification.notification_service.dto.StatutUpdateRequest;
import com.notification.notification_service.model.Notification;
import com.notification.notification_service.repository.NotificationRepository;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate; // Pour des requêtes plus complexes
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private MongoTemplate mongoTemplate; // Utilisé pour les requêtes de filtrage plus complexes

    public Notification createNotification(NotificationRequest request) {
        Notification notification = new Notification(
                request.getExpediteurId(),
                request.getDestinataireId(),
                request.getTitre(),
                request.getDescription()
        );
        return notificationRepository.save(notification);
    }

    public Optional<Notification> getNotificationById(String id) {
        return notificationRepository.findById(id);
    }

    // Méthode pour obtenir les notifications avec filtres, pagination et tri
    public Page<Notification> getFilteredNotifications(
            String destinataireId,
            String utilisateurId,
            String statut, // "Lue" ou "Non Lue"
            String expediteurId,
            int page,
            int size,
            String sortBy,
            String sortOrder) {

        // Construire une requête MongoDB dynamique
        Query mongoQuery = new Query();
        List<Criteria> criteriaList = new ArrayList<>();

        if (expediteurId != null && !expediteurId.isEmpty()) {
            criteriaList.add(Criteria.where("expediteurId").is(expediteurId));
        }
        if (destinataireId != null && !destinataireId.isEmpty()) {
            // Vérifie si l'ID est dans le tableau destinataireId
            criteriaList.add(Criteria.where("destinataireId").in(destinataireId));
        }
        if (utilisateurId != null && !utilisateurId.isEmpty()) {
            // Filtrer par statutNotification[] où un utilisateur a un certain statut
            Criteria userStatutCriteria = Criteria.where("statutNotification").elemMatch(Criteria.where("utilisateurId").is(utilisateurId));
            if (statut != null && !statut.isEmpty()) {
                userStatutCriteria.and("statut").is(statut);
            }
            criteriaList.add(userStatutCriteria);
        }

        if (!criteriaList.isEmpty()) {
            mongoQuery.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        // Pagination
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortOrder), sortBy));
        mongoQuery.with(pageable);

        // Exécuter la requête
        List<Notification> notifications = mongoTemplate.find(mongoQuery, Notification.class);
        long total = mongoTemplate.count(mongoQuery, Notification.class); // Compter le total sans pagination

        return new org.springframework.data.domain.PageImpl<>(notifications, pageable, total);
    }


    public Optional<Notification> updateNotificationStatus(String notificationId, StatutUpdateRequest request) {
        return notificationRepository.findById(notificationId).map(notification -> {
            // La validation du statut se fait déjà au niveau du DTO avec @Pattern
            notification.updateStatutForUser(request.getUtilisateurId(), request.getStatut());
            return notificationRepository.save(notification);
        });
    }

    public boolean deleteNotification(String id) {
        if (notificationRepository.existsById(id)) {
            notificationRepository.deleteById(id);
            return true;
        }
        return false;
    }
}