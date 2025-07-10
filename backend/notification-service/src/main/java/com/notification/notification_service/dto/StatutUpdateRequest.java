package com.notification.notification_service.dto;


import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Data
public class StatutUpdateRequest {
    @NotBlank(message = "L'ID de l'utilisateur ne peut pas être vide")
    private String utilisateurId;
    
    @NotBlank(message = "Le statut ne peut pas être vide")
    @Pattern(regexp = "Lue|Non Lue", message = "Le statut doit être 'Lue' ou 'Non Lue'")
    private String statut;
}