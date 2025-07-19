
package com.notification.notification_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatutNotification {
    private String utilisateurId;
    private String statut; // "Lue" ou "Non Lue"
}
