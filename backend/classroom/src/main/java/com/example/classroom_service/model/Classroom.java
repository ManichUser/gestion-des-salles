package com.example.classroom_service.model;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "salle_de_classe")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Classroom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutSalle statut;

    public enum StatutSalle {
        LIBRE,
        RESERVEE,
        OCCUPEE
    }
}
