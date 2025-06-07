package com.example.reservationsalle.model;

// src/main/java/com/reservationservice/model/Salle.java

import lombok.Data;

// Represents a room retrieved from SalleService
@Data // Generates getters, setters, toString, equals, hashCode
public class Salle {
    private Long id;
    private String nom;
    private String statut; // FREE, RESERVED, OCCUPIED (as per spec)
    private String filiere; // Default branch of the room
    private String niveau;  // Default level of the room
}
