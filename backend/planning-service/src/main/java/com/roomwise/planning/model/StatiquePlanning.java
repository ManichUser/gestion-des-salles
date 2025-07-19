package com.roomwise.planning.model;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Entity
@Table(name = "statique_planning")
public class StatiquePlanning {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private LocalTime heureDebut;
    private LocalTime heureFin;

    private String proprietaireFiliere;
    private String proprietaireNiveau;
    private String salleReserver;
    private String coursPrevu;
    private String jours;

    private Long AdminId; 


}
