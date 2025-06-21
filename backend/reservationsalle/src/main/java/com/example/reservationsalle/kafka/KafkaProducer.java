package com.example.reservationsalle.kafka;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class KafkaProducer {

    @Autowired
    private KafkaTemplate<String, Map<String, Object>> kafkaTemplate;

    public void sendConfirmationRequest(Long reservationId, String email, String lien) {
        Map<String, Object> message = new HashMap<>();
        message.put("reservationId", reservationId);
        message.put("email", email);
        message.put("confirmationLink", lien);

        kafkaTemplate.send("reservation-confirmation", message);
    }
}