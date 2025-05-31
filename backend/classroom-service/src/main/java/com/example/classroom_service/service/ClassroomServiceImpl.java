package com.example.classroom_service.service;

import com.example.classroom_service.model.Classroom;
import com.example.classroom_service.model.Classroom.StatutSalle;
import com.example.classroom_service.repository.ClassroomRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClassroomServiceImpl implements ClassroomService {

    private final ClassroomRepository classroomRepository;

    @Override
    public Classroom createRoom(Classroom classroom) {
        return classroomRepository.save(classroom);
    }

    @Override
    public Classroom updateRoom(Long id, Classroom updatedRoom) {
        Classroom existing = classroomRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Salle non trouvée"));
        existing.setNom(updatedRoom.getNom());
        existing.setStatut(updatedRoom.getStatut());
        return classroomRepository.save(existing);
    }

    @Override
    public void deleteRoom(Long id) {
        if (!classroomRepository.existsById(id)) {
            throw new EntityNotFoundException("Salle non trouvée");
        }
        classroomRepository.deleteById(id);
    }

    @Override
    public Classroom getRoomById(Long id) {
        return classroomRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Salle non trouvée"));
    }

    @Override
    public List<Classroom> getAllRooms() {
        return classroomRepository.findAll();
    }

    @Override
    public Classroom updateRoomStatut(Long id, StatutSalle statut) {
        Classroom room = classroomRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Salle non trouvée"));
        room.setStatut(statut);
        return classroomRepository.save(room);
    }
}
