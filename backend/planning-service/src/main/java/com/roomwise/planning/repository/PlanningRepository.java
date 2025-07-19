package com.roomwise.planning.repository;

import com.roomwise.planning.model.Planning;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface PlanningRepository extends JpaRepository<Planning, Long> {
    List<Planning> findByDate(LocalDate date);

    
}
