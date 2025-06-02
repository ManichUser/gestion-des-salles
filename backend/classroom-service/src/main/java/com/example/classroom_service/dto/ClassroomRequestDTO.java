package com.example.classroom_service.dto;

import com.example.classroom_service.model.Classroom.StatutSalle;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ClassroomRequestDTO {

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotNull(message = "Le statut est obligatoire")
    private StatutSalle statut;
}
