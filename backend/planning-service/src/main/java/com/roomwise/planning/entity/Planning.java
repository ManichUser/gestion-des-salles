package com.roomwise.planning.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Data
@NoArgsConstructor
@Table (name="Planning")
@AllArgsConstructor
public class Planning {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private LocalTime heureDebut;
    private LocalTime heureFin;

    private String cours;
    private String proprietaireFiliere;
    private String proprietaireNiveau;

    private Long salleId; 
    private Long adminId;
}
