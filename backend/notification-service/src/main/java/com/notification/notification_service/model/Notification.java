package com.notification.notification_service.model;
// src/main/java/com/notificationservice/model/Notification.java


import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@Document(collection = "notifications") // Indique que cette classe est un document MongoDB
public class Notification {

    @Id // Indique que 'id' est l'identifiant unique du document
    private String id; // MongoDB génère des IDs de type ObjectId (String)

    private String expediteurId;
    private List<String> destinataireId; // Liste de String pour les IDs des destinataires
    private String titre;
    private String description;
    private List<StatutNotification> statutNotification = new ArrayList<>(); // Liste des statuts par utilisateur

    private LocalDateTime createdAt; // Champ pour stocker la date et l'heure de création

    // Constructeur personnalisé pour la création d'une nouvelle notification
    public Notification(String expediteurId, List<String> destinataireId, String titre, String description) {
        this.expediteurId = expediteurId;
        this.destinataireId = destinataireId;
        this.titre = titre;
        this.description = description;
        this.createdAt = LocalDateTime.now();
        // Initialisation automatique des statuts à "Non Lue" pour chaque destinataire
        if (destinataireId != null) {
            this.statutNotification = destinataireId.stream()
                                        .map(id -> new StatutNotification(id, "Non Lue"))
                                        .collect(Collectors.toList());
        }
    }

    // Méthode utilitaire pour mettre à jour le statut d'un utilisateur spécifique
    public void updateStatutForUser(String userId, String newStatut) {
        this.statutNotification.stream()
            .filter(sn -> sn.getUtilisateurId().equals(userId))
            .findFirst()
            .ifPresent(sn -> sn.setStatut(newStatut));
    }
}