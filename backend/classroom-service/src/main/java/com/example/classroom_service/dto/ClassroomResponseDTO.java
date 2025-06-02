package com.example.classroom_service.dto;

import com.example.classroom_service.model.Classroom.StatutSalle;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class ClassroomResponseDTO {
    private Long id;
    private String nom;
    private StatutSalle statut;
}
