package com.roomwise.planning.model;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

@Data
@Entity
@Table(name = "planning")
public class Planning {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
  
    private LocalDate date;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime heureDebut;
    
    @JsonFormat(pattern = "HH:mm") 
    private LocalTime heureFin;

    private String proprietaireFiliere;
    private String proprietaireNiveau;
    private String salleReserver;
    private String coursPrevu;

    private Long delegueId; 


}
