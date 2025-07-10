// src/main/java/com/notificationservice/dto/NotificationRequest.java
package com.notification.notification_service.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

@Data
public class NotificationRequest {
    @NotBlank(message = "L'ID de l'expéditeur ne peut pas être vide")
    private String expediteurId;
    
    @NotEmpty(message = "Au moins un destinataire est requis")
    private List<String> destinataireId; // Doit être une liste
    
    @NotBlank(message = "Le titre ne peut pas être vide")
    private String titre;
    
    @NotBlank(message = "La description ne peut pas être vide")
    private String description;
}

