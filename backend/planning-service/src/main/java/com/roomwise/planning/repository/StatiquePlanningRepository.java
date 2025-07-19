
package com.roomwise.planning.repository;

import com.roomwise.planning.model.StatiquePlanning;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StatiquePlanningRepository extends JpaRepository<StatiquePlanning, Long> {
  
    List<StatiquePlanning> findByJours(String jours);
    List<StatiquePlanning> findByProprietaireFiliereAndProprietaireNiveau(String filiere, String niveau);
}