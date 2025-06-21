package com.roomwise.planning.repository;

import com.roomwise.planning.entity.Planning;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface PlanningRepository extends JpaRepository<Planning, Long> {

    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN TRUE ELSE FALSE END FROM Planning p " +
            "WHERE p.salleId = :salleId AND p.date = :date " +
            "AND ((p.heureDebut < :fin AND p.heureFin > :debut))")
    boolean hasConflict(@Param("salleId") Long salleId,
                        @Param("date") LocalDate date,
                        @Param("debut") LocalTime debut,
                        @Param("fin") LocalTime fin);

    List<Planning> findBySalleId(Long salleId);
    List<Planning> findByDate(LocalDate date);
}