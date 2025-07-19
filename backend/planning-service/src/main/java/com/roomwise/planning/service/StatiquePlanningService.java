package com.roomwise.planning.service;

import com.roomwise.planning.model.StatiquePlanning;
import com.roomwise.planning.repository.StatiquePlanningRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StatiquePlanningService {

    private final StatiquePlanningRepository statiquePlanningRepository;

    @Autowired
    public StatiquePlanningService(StatiquePlanningRepository statiquePlanningRepository) {
        this.statiquePlanningRepository = statiquePlanningRepository;
    }

    // Méthode pour créer ou mettre à jour un StatiquePlanning
    public StatiquePlanning saveStatiquePlanning(StatiquePlanning statiquePlanning) {
        System.out.println("Requête de création de planning reçue :");
        System.out.println("Salle réservée: " + statiquePlanning.getSalleReserver());
        System.out.println("Cours prévu: " + statiquePlanning.getCoursPrevu());
        System.out.println("Jours: " + statiquePlanning.getJours());
        System.out.println("Admin ID: " + statiquePlanning.getAdminId());
        System.out.println("Objet planning complet: " + statiquePlanning.toString()); 
        return statiquePlanningRepository.save(statiquePlanning);
    }

    // Méthode pour récupérer un StatiquePlanning par son ID
    public Optional<StatiquePlanning> getStatiquePlanningById(Long id) {
        return statiquePlanningRepository.findById(id);
    }

    // Méthode pour récupérer tous les StatiquePlannings
    public List<StatiquePlanning> getAllStatiquePlannings() {
        return statiquePlanningRepository.findAll();
    }

    // Méthode pour supprimer un StatiquePlanning par son ID
    public void deleteStatiquePlanning(Long id) {
        statiquePlanningRepository.deleteById(id);
    }

    
    public List<StatiquePlanning> getStatiquePlanningsByJours(String jours) {
        return statiquePlanningRepository.findByJours(jours);
    }
    public List<StatiquePlanning> getStatiquePlanningsByFiliereAndNiveau(String filiere, String niveau) {
        return statiquePlanningRepository.findByProprietaireFiliereAndProprietaireNiveau(filiere, niveau);
    }
}