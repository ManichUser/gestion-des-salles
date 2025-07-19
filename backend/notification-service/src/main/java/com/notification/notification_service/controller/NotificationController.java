// src/main/java/com/notificationservice/controller/NotificationController.java
package com.notification.notification_service.controller;

import com.notification.notification_service.dto.NotificationRequest;
import com.notification.notification_service.dto.StatutUpdateRequest;
import com.notification.notification_service.model.Notification;
import com.notification.notification_service.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // POST /api/notifications - Créer une nouvelle notification
    @PostMapping
    public ResponseEntity<Notification> createNotification(@Valid @RequestBody NotificationRequest request) {
        Notification newNotification = notificationService.createNotification(request);
        return new ResponseEntity<>(newNotification, HttpStatus.CREATED);
    }

    // GET /api/notifications/{id} - Obtenir une notification par ID
    @GetMapping("/{id}")
    public ResponseEntity<Notification> getNotificationById(@PathVariable String id) {
        return notificationService.getNotificationById(id)
                .map(notification -> new ResponseEntity<>(notification, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // GET /api/notifications - Obtenir toutes les notifications avec filtres et pagination
    @GetMapping
    public ResponseEntity<Page<Notification>> getNotifications(
            @RequestParam(required = false) String destinataireId,
            @RequestParam(required = false) String utilisateurId,
            @RequestParam(required = false) String statut, // "Lue" ou "Non Lue"
            @RequestParam(required = false) String expediteurId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {

        Page<Notification> notifications = notificationService.getFilteredNotifications(
                destinataireId, utilisateurId, statut, expediteurId, page, size, sortBy, sortOrder);
        return new ResponseEntity<>(notifications, HttpStatus.OK);
    }

    // PATCH /api/notifications/{id}/statut - Mettre à jour le statut d'une notification pour un utilisateur
    @PatchMapping("/{id}/statut")
    public ResponseEntity<Notification> updateNotificationStatus(@PathVariable String id, @Valid @RequestBody StatutUpdateRequest request) {
        try {
            return notificationService.updateNotificationStatus(id, request)
                    .map(notification -> new ResponseEntity<>(notification, HttpStatus.OK))
                    .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Pour les statuts invalides ou autres erreurs
        }
    }

    // DELETE /api/notifications/{id} - Supprimer une notification
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable String id) {
        if (notificationService.deleteNotification(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content pour une suppression réussie
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 Not Found si la notification n'existe pas
    }
}