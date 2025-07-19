
package com.roomwise.planning.controller;

import com.roomwise.planning.model.StatiquePlanning;
import com.roomwise.planning.service.StatiquePlanningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/statiqueplannings") 
@CrossOrigin(origins = "*") // Permettre les requêtes CORS depuis n'importe quelle origine
public class StatiquePlanningController {

    private final StatiquePlanningService statiquePlanningService;

    @Autowired
    public StatiquePlanningController(StatiquePlanningService statiquePlanningService) {
        this.statiquePlanningService = statiquePlanningService;
    }

    // Créer un nouveau StatiquePlanning
    @PostMapping
    public ResponseEntity<StatiquePlanning> createStatiquePlanning(@RequestBody StatiquePlanning statiquePlanning) {
        // Vérifie si les champs obligatoires sont présents
        System.out.println("Requête de création de planning reçue :");
        System.out.println("Salle réservée: " + statiquePlanning.getSalleReserver());
        System.out.println("Cours prévu: " + statiquePlanning.getCoursPrevu());
        System.out.println("Jours: " + statiquePlanning.getJours());
        System.out.println("Admin ID: " + statiquePlanning.getAdminId());
        System.out.println("Objet planning complet: " + statiquePlanning.toString()); 
        StatiquePlanning savedStatiquePlanning = statiquePlanningService.saveStatiquePlanning(statiquePlanning);
        return new ResponseEntity<>(savedStatiquePlanning, HttpStatus.CREATED);
    }

    // Récupérer tous les StatiquePlannings
    @GetMapping
    public ResponseEntity<List<StatiquePlanning>> getAllStatiquePlannings() {
        List<StatiquePlanning> statiquePlannings = statiquePlanningService.getAllStatiquePlannings();
        return new ResponseEntity<>(statiquePlannings, HttpStatus.OK);
    }

    // Récupérer un StatiquePlanning par son ID
    @GetMapping("/{id}")
    public ResponseEntity<StatiquePlanning> getStatiquePlanningById(@PathVariable Long id) {
        Optional<StatiquePlanning> statiquePlanning = statiquePlanningService.getStatiquePlanningById(id);
        return statiquePlanning.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Mettre à jour un StatiquePlanning existant
    @PutMapping("/{id}")
    public ResponseEntity<StatiquePlanning> updateStatiquePlanning(@PathVariable Long id, @RequestBody StatiquePlanning statiquePlanning) {
        // Vérifie si le planning existe avant de le mettre à jour
        return statiquePlanningService.getStatiquePlanningById(id).map(existingPlanning -> {
            statiquePlanning.setId(id); // S'assurer que l'ID est bien défini pour la mise à jour
            StatiquePlanning updatedStatiquePlanning = statiquePlanningService.saveStatiquePlanning(statiquePlanning);
            return new ResponseEntity<>(updatedStatiquePlanning, HttpStatus.OK);
        }).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Supprimer un StatiquePlanning par son ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStatiquePlanning(@PathVariable Long id) {
        if (statiquePlanningService.getStatiquePlanningById(id).isPresent()) {
            statiquePlanningService.deleteStatiquePlanning(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content pour une suppression réussie
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    // Récupérer les StatiquePlannings par jours
    @GetMapping("/jours/{jours}")
    public ResponseEntity<List<StatiquePlanning>> getStatiquePlanningsByJours(@PathVariable String jours) {
        List<StatiquePlanning> statiquePlannings = statiquePlanningService.getStatiquePlanningsByJours(jours);
        return new ResponseEntity<>(statiquePlannings, HttpStatus.OK);
    }
    // Récupérer les StatiquePlannings par filière et niveau
    @GetMapping("/filiere/{filiere}/niveau/{niveau}")
    public ResponseEntity<List<StatiquePlanning>> getStatiquePlanningsByFiliereAndNiveau(@PathVariable String filiere, @PathVariable String niveau) {
        List<StatiquePlanning> statiquePlannings = statiquePlanningService.getStatiquePlanningsByFiliereAndNiveau(filiere, niveau);
        return new ResponseEntity<>(statiquePlannings, HttpStatus.OK);
    }
}