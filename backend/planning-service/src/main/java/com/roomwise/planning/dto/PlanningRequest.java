package com.roomwise.planning.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class PlanningRequest {
    private LocalDate date;
    private LocalTime heureDebut;
    private LocalTime heureFin;
    private String cours;
    private String proprietaireFiliere;
    private String proprietaireNiveau;
    private Long salleId;
}
