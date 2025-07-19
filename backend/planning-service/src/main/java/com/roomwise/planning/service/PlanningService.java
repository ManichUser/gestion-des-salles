package com.roomwise.planning.service;


import com.roomwise.planning.model.Planning;
import com.roomwise.planning.repository.PlanningRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PlanningService {

    @Autowired
    private PlanningRepository repository;

    public Planning create(Planning planning) {
        return repository.save(planning);
    }

    public List<Planning> getAll() {
        return repository.findAll();
    }

    public Optional<Planning> getById(Long id) {
        return repository.findById(id);
    }

    public List<Planning> getPlanningsByDate(LocalDate date){
        return repository.findByDate(date);
    }

    public Planning update(Long id, Planning newPlanning) {
        return repository.findById(id).map(planning -> {
            planning.setDate(newPlanning.getDate());
            planning.setHeureDebut(newPlanning.getHeureDebut());
            planning.setHeureFin(newPlanning.getHeureFin());
            planning.setProprietaireFiliere(newPlanning.getProprietaireFiliere());
            planning.setProprietaireNiveau(newPlanning.getProprietaireNiveau());
            planning.setSalleReserver(newPlanning.getSalleReserver());
            planning.setCoursPrevu(newPlanning.getCoursPrevu());
            planning.setDelegueId(newPlanning.getDelegueId());
            return repository.save(planning);
        }).orElseThrow(() -> new RuntimeException("Planning non trouvé"));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
