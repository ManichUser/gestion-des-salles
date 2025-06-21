package com.example.classroom_service.controller;

import com.example.classroom_service.dto.ClassroomRequestDTO;
import com.example.classroom_service.dto.ClassroomResponseDTO;
import com.example.classroom_service.model.Classroom;
import com.example.classroom_service.model.Classroom.StatutSalle;
import com.example.classroom_service.service.ClassroomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/classrooms")
@CrossOrigin(origins="*")
@RequiredArgsConstructor
public class ClassroomController {

    private final ClassroomService classroomService;  // classe concrète

    @PostMapping
    public ResponseEntity<ClassroomResponseDTO> createRoom(@Valid @RequestBody ClassroomRequestDTO dto) {
        Classroom classroom = new Classroom(null, dto.getNom(), dto.getStatut());
        Classroom saved = classroomService.createRoom(classroom);
        return ResponseEntity.ok(mapToDTO(saved));
    }

    @GetMapping
    public ResponseEntity<List<ClassroomResponseDTO>> getAllRooms() {
        List<ClassroomResponseDTO> rooms = classroomService.getAllRooms()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClassroomResponseDTO> getRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(mapToDTO(classroomService.getRoomById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClassroomResponseDTO> updateRoom(@PathVariable Long id,  @Valid @RequestBody ClassroomRequestDTO dto) {
        Classroom toUpdate = new Classroom(id, dto.getNom(), dto.getStatut());
        return ResponseEntity.ok(mapToDTO(classroomService.updateRoom(id, toUpdate)));
    }

    @PutMapping("/{id}/statut")
    public ResponseEntity<ClassroomResponseDTO> updateStatut(@PathVariable Long id,@RequestParam StatutSalle statut) {
        return ResponseEntity.ok(mapToDTO(classroomService.updateRoomStatut(id, statut)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        classroomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }

    private ClassroomResponseDTO mapToDTO(Classroom classroom) {
        return ClassroomResponseDTO.builder()
                .id(classroom.getId())
                .nom(classroom.getNom())
                .statut(classroom.getStatut())
                .build();
    }
}
