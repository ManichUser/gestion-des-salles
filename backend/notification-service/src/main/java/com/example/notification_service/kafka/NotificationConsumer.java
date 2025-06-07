package com.example.notification_service.kafka;

import com.example.notification_service.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class NotificationConsumer {

    @Autowired
    private EmailService emailService;

    @KafkaListener(topics = "reservation-confirmation", groupId = "notif-group")
    public void consume(Map<String, Object> message) {
        String email = (String) message.get("email");
        String link = (String) message.get("confirmationLink");

        String body = "Bonjour,\n\nVeuillez confirmer ou rejeter la réservation en cliquant sur ce lien :\n" + link;
        emailService.sendEmail(email, "Confirmation de réservation", body);
    }
}

