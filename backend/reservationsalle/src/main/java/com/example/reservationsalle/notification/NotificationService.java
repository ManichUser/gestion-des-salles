// src/main/java/com/reservationservice/notification/NotificationService.java
package com.example.reservationsalle.notification;
// src/main/java/com/example/reservationsalle/notification/NotificationService.java

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class NotificationService {

    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    // Noms des exchanges et routing keys pour l'envoi des messages
    public static final String NOTIFICATION_EXCHANGE = "notification.exchange"; // Direct Exchange
    public static final String BROADCAST_NOTIFICATION_EXCHANGE = "broadcast.notification.exchange"; // Fanout Exchange

    // Routing keys spécifiques pour les messages individuels et de groupe
    public static final String ROUTING_KEY_INDIVIDUAL = "notification.individual";
    public static final String ROUTING_KEY_GROUP = "notification.group";
    // Pas de routing key spécifique pour le broadcast car Fanout Exchange l'ignore

    public NotificationService(RabbitTemplate rabbitTemplate, ObjectMapper objectMapper) {
        this.rabbitTemplate = rabbitTemplate;
        this.objectMapper = objectMapper;
    }

    /**
     * Envoie une notification individuelle via RabbitMQ, simulant un SMS.
     * @param recipient Le destinataire de la notification (ex: nom complet, numéro de téléphone simulé).
     * @param message Le contenu du message.
     * @param type Le type de notification (ex: "RESERVATION_CONFIRMED", "RESERVATION_REJECTED").
     */
    public void sendNotification(String recipient, String message, String type) {
        try {
            ObjectNode notificationPayload = objectMapper.createObjectNode();
            notificationPayload.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            notificationPayload.put("recipient", recipient);
            notificationPayload.put("message", message);
            notificationPayload.put("type", type);
            notificationPayload.put("deliveryMethod", "SMS"); // Indique la méthode de livraison simulée

            String jsonPayload = objectMapper.writeValueAsString(notificationPayload);

            System.out.println("NotificationService: Tentative d'envoi de notification SMS individuelle à RabbitMQ.");
            rabbitTemplate.convertAndSend(NOTIFICATION_EXCHANGE, ROUTING_KEY_INDIVIDUAL, jsonPayload);
            System.out.println("NotificationService: Notification SMS individuelle envoyée avec succès. Payload: " + jsonPayload);
        } catch (Exception e) {
            System.err.println("NotificationService: Erreur lors de l'envoi de la notification SMS individuelle à RabbitMQ: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Envoie une notification de groupe via RabbitMQ, simulant un SMS de groupe.
     * @param groupIdentifier L'identifiant du groupe (ex: "Informatique-L2").
     * @param message Le contenu du message.
     * @param type Le type de notification.
     */
    public void sendGroupNotification(String groupIdentifier, String message, String type) {
        try {
            ObjectNode notificationPayload = objectMapper.createObjectNode();
            notificationPayload.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            notificationPayload.put("groupIdentifier", groupIdentifier);
            notificationPayload.put("message", message);
            notificationPayload.put("type", type);
            notificationPayload.put("deliveryMethod", "SMS"); // Indique la méthode de livraison simulée

            String jsonPayload = objectMapper.writeValueAsString(notificationPayload);

            System.out.println("NotificationService: Tentative d'envoi de notification SMS de groupe à RabbitMQ.");
            rabbitTemplate.convertAndSend(NOTIFICATION_EXCHANGE, ROUTING_KEY_GROUP, jsonPayload);
            System.out.println("NotificationService: Notification SMS de groupe envoyée avec succès. Payload: " + jsonPayload);
        } catch (Exception e) {
            System.err.println("NotificationService: Erreur lors de l'envoi de la notification SMS de groupe à RabbitMQ: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Envoie une notification de diffusion générale via RabbitMQ, simulant un SMS broadcast.
     * @param message Le contenu du message de diffusion.
     * @param type Le type de notification (ex: "RESERVATION_CONFIRMED_BROADCAST").
     */
    public void sendBroadcastNotification(String message, String type) {
        try {
            ObjectNode notificationPayload = objectMapper.createObjectNode();
            notificationPayload.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            notificationPayload.put("message", message);
            notificationPayload.put("type", type);
            notificationPayload.put("deliveryMethod", "SMS_BROADCAST"); // Indique la méthode de livraison simulée

            String jsonPayload = objectMapper.writeValueAsString(notificationPayload);

            System.out.println("NotificationService: Tentative d'envoi de notification SMS de diffusion générale à RabbitMQ.");
            rabbitTemplate.convertAndSend(BROADCAST_NOTIFICATION_EXCHANGE, "", jsonPayload); // Routing key ignored by Fanout Exchange
            System.out.println("NotificationService: Notification SMS de diffusion générale envoyée avec succès. Payload: " + jsonPayload);
        } catch (Exception e) {
            System.err.println("NotificationService: Erreur lors de l'envoi de la notification SMS de diffusion à RabbitMQ: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
