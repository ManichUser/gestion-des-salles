package com.example.classroom_service.repository;

import com.example.classroom_service.model.Classroom;
import com.example.classroom_service.model.Classroom.StatutSalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassroomRepository extends JpaRepository<Classroom, Long> {

    List<Classroom> findByStatut(StatutSalle statut);
}
