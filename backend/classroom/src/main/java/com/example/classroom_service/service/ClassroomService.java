package com.example.classroom_service.service;

import com.example.classroom_service.model.Classroom;
import com.example.classroom_service.model.Classroom.StatutSalle;

import java.util.List;

public interface ClassroomService {

    Classroom createRoom(Classroom classroom);

    Classroom updateRoom(Long id, Classroom updatedRoom);

    void deleteRoom(Long id);

    Classroom getRoomById(Long id);

    List<Classroom> getAllRooms();

    Classroom updateRoomStatut(Long id, StatutSalle statut);
}
